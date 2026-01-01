const { Member, UniversityStudent, PrivateCustomer, Enrollment, Payment } = require('../models')

const getCourses = async (req, res) =>{
    const students = await UniversityStudent.findAll({
        include : [{
            model: Member,
            required: true,
            include : [{
            model: Enrollment,
            required: true,
                    include : [{
                    model: Payment,
                    required: true
                }]
            }]
        }]
    })
    res.send(students)
}


module.exports = { getCourses }