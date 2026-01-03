const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

const addModuleToCourse = async (req, res) => {
    const tutorId = Number(req.body.tutorId);
    const courseId = Number(req.body.courseId);
    const name = req.body.name;
    const subject = req.body.subject;

    if (!tutorId || !courseId || !name || !subject) {
        return res.status(400).json({
            error: "Required: tutorId, courseId, name, subject"
        });
    }

    try {
        // Precondition
        const teaches = await sequelize.query(
            `SELECT 1
             FROM IsTaughtBy
             WHERE TutorId = :tutorId AND CourseId = :courseId
                 LIMIT 1`,
            { replacements: { tutorId, courseId }, type: QueryTypes.SELECT }
        );

        if (teaches.length === 0) {
            return res.status(403).json({ error: "Tutor does not teach this course." });
        }

        const next = await sequelize.query(
            `SELECT COALESCE(MAX(Id), 0) + 1 AS nextId
             FROM Module
             WHERE CourseId = :courseId`,
            { replacements: { courseId }, type: QueryTypes.SELECT }
        );

        const moduleId = next[0].nextId;

        // INSERT-Operation
        await sequelize.query(
            `INSERT INTO Module (CourseId, Id, Name, Subject)
             VALUES (:courseId, :moduleId, :name, :subject)`,
            { replacements: { courseId, moduleId, name, subject }, type: QueryTypes.INSERT }
        );

        res.status(201).json({
            message: "Module added to course",
            module: { CourseId: courseId, Id: moduleId, Name: name, Subject: subject }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const getModulesReport = async (req, res) => {
    const tutorId = Number(req.body.tutorId);
    const courseId = req.body.courseId != null ? Number(req.body.courseId) : null;

    if (!tutorId) {
        return res.status(400).json({ error: "tutorId is required" });
    }

    try {
        const rows = await sequelize.query(
            `SELECT
                 t.Id AS TutorId,
                 t.Name AS TutorName,
                 t.Surname AS TutorSurname,
                 c.Id AS CourseId,
                 c.Name AS CourseName,
                 m.Id AS ModuleId,
                 m.Name AS ModuleName,
                 m.Subject AS ModuleSubject
             FROM Tutor t
                      JOIN IsTaughtBy itb ON itb.TutorId = t.Id
                      JOIN Course c ON c.Id = itb.CourseId
                      LEFT JOIN Module m ON m.CourseId = c.Id
             WHERE t.Id = :tutorId
               AND (:courseId IS NULL OR c.Id = :courseId)
             ORDER BY c.Id, m.Id`,
            { replacements: { tutorId, courseId }, type: QueryTypes.SELECT }
        );

        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = { addModuleToCourse, getModulesReport };
