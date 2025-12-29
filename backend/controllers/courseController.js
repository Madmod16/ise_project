const { Course } = require('../models')

const getCourses = async (req, res) =>{
    const listOfCourses = await Course.findAll()
    res.send(listOfCourses)
}

module.exports = { getCourses }