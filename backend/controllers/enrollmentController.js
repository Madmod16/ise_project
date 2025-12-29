const { Enrollment, Payment } = require('../models')

const addEnrollment = async (req, res) => {
    try {
        const { MemberID, CourseID} = req.body;

        if (!MemberID || !CourseID) {
            return res.status(400).json({ error: 'MemberID and CourseID are required' });
        }
        
        const newEnrollment = await Enrollment.create({
            MemberID: MemberID,
            CourseID: CourseID,
            EnrollDate: new Date()
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

module.exports = { addEnrollment }