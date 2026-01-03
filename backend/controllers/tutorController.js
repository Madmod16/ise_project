const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

const getTutors = async (req, res) => {
    try {
        const rows = await sequelize.query(
            `SELECT Id, Name, Surname, Specialization, Accreditation
             FROM Tutor
             ORDER BY Surname, Name`,
            { type: QueryTypes.SELECT }
        );
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const getTutorCourses = async (req, res) => {
    const tutorId = Number(req.params.id);

    try {
        const rows = await sequelize.query(
            `SELECT
                 c.Id AS CourseId,
                 c.Name AS CourseName,
                 c.Field,
                 c.Price,
                 p.Id AS ProgramId,
                 p.Name AS ProgramName
             FROM IsTaughtBy itb
                      JOIN Course c  ON c.Id = itb.CourseId
                      JOIN Program p ON p.Id = c.ProgramId
             WHERE itb.TutorId = :tutorId
             ORDER BY p.Name, c.Name`,
            { replacements: { tutorId }, type: QueryTypes.SELECT }
        );

        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = { getTutors, getTutorCourses };
