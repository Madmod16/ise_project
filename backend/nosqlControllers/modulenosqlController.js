const db = require("../mongoDB");
const dbo = db.getDb();

function toNum(x) {
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
}

const addModuleToCourseMongo = async (req, res) => {
    try {
        const tutorId = toNum(req.body.tutorId);
        const courseId = toNum(req.body.courseId);
        const name = (req.body.name || "").trim();
        const subject = (req.body.subject || "").trim();

        if (!tutorId || !courseId || !name || !subject) {
            return res.status(400).json({ error: "Required: tutorId, courseId, name, subject" });
        }

        const tutor = await dbo.collection("tutors").findOne({
            _id: tutorId,
            "Courses.CourseID": courseId
        });

        if (!tutor) {
            return res.status(403).json({ error: "Tutor does not teach this course." });
        }

        const course = await dbo.collection("courses").findOne({ _id: courseId });
        if (!course) return res.status(404).json({ error: "Course not found" });

        const modules = Array.isArray(course.modules) ? course.modules : [];
        const maxId = modules.reduce((m, it) => {
            const v = Number(it?.module_id ?? it?.Id ?? 0);
            return Number.isFinite(v) ? Math.max(m, v) : m;
        }, 0);

        const moduleId = maxId + 1;

        const newModule = {
            module_id: moduleId,
            name,
            subject
        };

        await dbo.collection("courses").updateOne(
            { _id: courseId },
            { $push: { modules: newModule } }
        );

        return res.status(201).json({
            message: "Module added to course",
            module: { CourseId: courseId, Id: moduleId, Name: name, Subject: subject }
        });
    } catch (e) {
        console.error("addModuleToCourseMongo failed:", e);
        return res.status(500).json({ error: e.message });
    }
};

const getModulesReportMongo = async (req, res) => {
    try {
        const tutorId = toNum(req.body.tutorId);
        const courseId = req.body.courseId != null ? toNum(req.body.courseId) : null;

        if (!tutorId) return res.status(400).json({ error: "tutorId is required" });

        const pipeline = [
            { $match: { _id: tutorId } },
            {
                $addFields: {
                    courseIds: {
                        $map: {
                            input: { $ifNull: ["$Courses", []] },
                            as: "c",
                            in: "$$c.CourseID"
                        }
                    }
                }
            },
            // aggregation pipeline
            ...(courseId ? [{ $addFields: { courseIds: [courseId] } }] : []),

            {
                $lookup: {
                    from: "courses",
                    let: { ids: "$courseIds" },
                    pipeline: [
                        { $match: { $expr: { $in: ["$_id", "$$ids"] } } },
                        { $project: { _id: 1, course_name: 1, name: 1, modules: 1 } }
                    ],
                    as: "courses"
                }
            },

            { $unwind: { path: "$courses", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$courses.modules", preserveNullAndEmptyArrays: true } },

            {
                $project: {
                    TutorId: "$_id",
                    TutorName: "$Name",
                    TutorSurname: "$Surname",
                    CourseId: "$courses._id",
                    CourseName: { $ifNull: ["$courses.course_name", "$courses.name"] },
                    ModuleId: { $ifNull: ["$courses.modules.module_id", "-"] },
                    ModuleName: { $ifNull: ["$courses.modules.name", "-"] },
                    ModuleSubject: { $ifNull: ["$courses.modules.subject", "-"] }
                }
            },
            { $sort: { CourseId: 1, ModuleId: 1 } }
        ];

        const rows = await dbo.collection("tutors").aggregate(pipeline).toArray();
        res.json(rows);
    } catch (e) {
        console.error("getModulesReportMongo failed:", e);
        res.status(500).json({ error: e.message });
    }
};

module.exports = { addModuleToCourseMongo, getModulesReportMongo };
