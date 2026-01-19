const db = require("../mongoDB");
const dbo = db.getDb();

const getMongoTutors = async (req, res) => {
    try {
        const result = await dbo.collection("tutors").aggregate([
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
            {
                $lookup: {
                    from: "courses",
                    let: { ids: "$courseIds" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ["$_id", "$$ids"] }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                course_name: 1,
                                name: 1,
                                CourseName: 1,
                                Field: 1,
                                field: 1,
                                Price: 1,
                                price: 1
                            }
                        }
                    ],
                    as: "coursesTaught"
                }
            },
            {
                $project: {
                    courseIds: 0
                }
            }
        ]).toArray();

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching tutors:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { getMongoTutors };
