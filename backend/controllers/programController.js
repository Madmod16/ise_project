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
    const { ProgramId } = req.body;
    
    if (!ProgramId) {
        return res.status(400).json({ error: 'ProgramId is required' });
    }
    
    try {
        const report = await sequelize.query(`
            SELECT
                p.Id AS ProgramId,             
                p.Name AS ProgramName,          
                st.StudentID AS StudentID,      
                m.Id AS MemberId,               
                CONCAT(m.Name, ' ', m.Surname) AS StudentName,
                COUNT(DISTINCT c.Id) AS CoursesInProgram,
                GROUP_CONCAT(DISTINCT c.Name ORDER BY c.Name SEPARATOR ', ') AS CourseList,
                SUM(pay.Amount) AS TotalProgramIncome
            FROM universitystudent AS st
                JOIN member AS m ON m.Id = st.MemberId
                JOIN enrollment AS e ON e.MemberId = m.Id
                JOIN payment AS pay ON pay.EnrollmentId = e.Id
                JOIN course AS c ON c.Id = e.CourseId
                JOIN program AS p ON p.Id = c.ProgramId
            WHERE p.Id = :ProgramId
            GROUP BY
                p.Id, p.Name,
                m.Id, m.Name, m.Surname
            ORDER BY CoursesInProgram DESC, StudentName
        `, {
            replacements: { ProgramId },
            type: QueryTypes.SELECT
        });

        res.status(200).json(report);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getProgramsWithCourses, getAnalyticsReport };