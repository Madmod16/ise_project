const { Program, Course } = require('../models');

const getProgramsWithCourses = async (req, res) => {
  try {
    const programs = await Program.findAll({
      include: [{
        model: Course,
        as: 'Courses',
        attributes: ['CourseID', 'CourseName', 'Field', 'Price'] 
      }]
    });
    
    res.status(200).json(programs);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProgramsWithCourses };