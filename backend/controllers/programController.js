/*
const { Program, Course } = require('../models');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

const getProgramsWithCourses = async (req, res) => {
  try {
    const programs = await Program.findAll({
      include: [{
        model: Course,
        as: 'Courses',
        attributes: ['Id', 'Name', 'Field', 'Price']
      }]
    });
    
    res.status(200).json(programs);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAnalyticsReport = async (req, res) => {
    const { Id } = req.body;
    try {
        const report = await sequelize.query(`
            SELECT
                p.Id,
                p.ProgramName,
                st.StudentID,
                m.MemberID,
            CONCAT(m.MemberName, ' ', m.MemberSurname) AS StudentName,
            COUNT(DISTINCT c.CourseID) AS CoursesInProgram,
            GROUP_CONCAT(DISTINCT c.CourseName ORDER BY c.CourseName SEPARATOR ', ') AS CourseList,
            SUM(pay.TotalAmount) AS TotalProgramIncome
            FROM universitystudent AS st
            JOIN member AS m
                ON m.MemberID = st.MemberID
            JOIN enrollment AS e
                ON e.MemberID = m.MemberID
            JOIN payment AS pay
                ON pay.EnrollmentID = e.EnrollmentID
            JOIN course AS c
                ON c.CourseID = e.CourseID
            JOIN program AS p
                ON p.ProgramID = c.ProgramID
            WHERE p.ProgramID = :ProgramID
            GROUP BY
                p.ProgramID, p.ProgramName,
                m.MemberID, m.MemberName, m.MemberSurname
            ORDER BY CoursesInProgram DESC, StudentName;
        `, {
            replacements: { Id: ProgramId },
            type: QueryTypes.SELECT
        });

        res.status(200).json(report);
    } catch (error) {
        console.error('Full error:', error);
        console.error('Error message:', error.message);
        console.error('SQL error:', error.original);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getProgramsWithCourses, getAnalyticsReport };

 */