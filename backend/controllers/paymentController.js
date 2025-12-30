const { Payment } = require('../models')

const addPayment = async (req, res) => {
    try {
        const { EnrollmentID, Type, Price } = req.body;
        const discount = 0.65
        
        if (!Type || !EnrollmentID || !Price) {
            return res.status(400).json({ error: 'Type, EnrollmentID and Price are required'});
        }
        
        const newPayment = await Payment.create({
            EnrollmentID: EnrollmentID,
            PayDate: new Date(),
            TotalAmount: (Type === "student") ? Price - (Price * discount) : Price,
            Discount : (Type === "student") ? discount : 0
        });

        res.status(201).json({ 
            message: 'Payment created successfully',
            enrollment: newPayment 
        });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ 
            error: 'Failed to create payment',
            details: error.message 
        });
    }
}

module.exports = { addPayment }