/*const { Enrollment, Payment } = require('../models')

const addEnrollment = async (req, res) => {
    try {
        const { MemberId, CourseId} = req.body;

        if (!MemberId || !CourseId) {
            return res.status(400).json({ error: 'MemberId and CourseId are required' });
        }
        
        const newEnrollment = await Enrollment.create({
            MemberId: MemberId,
            CourseId: CourseId,
            Date: new Date(),
            Validity: Boolean
        });

        res.status(201).json({ 
            message: 'Enrollment created successfully',
            enrollment: newEnrollment 
        });
    } catch (error) {
        console.error('Error creating enrollment:', error);
        res.status(500).json({ 
            error: 'Failed to create enrollment',
            details: error.message 
        });
    }
}

module.exports = { addEnrollment }*/