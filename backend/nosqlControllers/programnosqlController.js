const db = require("../mongoDB")
const dbo = db.getDb();

const getMongoPrograms = async (req, res) =>{
    try {
        const result = await dbo.collection('programs').aggregate([
        { $lookup:
            {
                from: 'courses',
                localField: 'courses.CourseID',
                foreignField: '_id',
                as: 'enrolled_courses'
            }
        }
        ]).toArray();
        
        console.log(result);
        
        res.status(200).json(result); 
        
        return result;
    } catch (error) {
        console.error("Error fetching programs:", error);
        res.status(500).send("Internal Server Error");
    }
};

const addEnrollment = async (req, res) => {
    try {
        const { MemberID, CourseID } = req.body;
        const date = new Date()
        const dateString = date.toISOString().split('T')[0]

        if ( !MemberID || !CourseID ) {
            return res.status(400).json({ error: 'MemberID, CourseID, Type and Price are required' });
        }
        
        const newEnrollment = {
            CourseID: CourseID,
            EnrollDate: dateString
        };

        await dbo.collection("members").updateOne(
            { _id: MemberID }, 
            { $push: { Enrollments: newEnrollment } } 
        );

        res.status(201).json({ 
            message: 'Enrollment/payment created successfully',
        });

    } catch (error) {
        console.error('Error creating enrollment:', error);
        res.status(500).json({ 
            error: 'Failed to create enrollment',
            details: error.message 
        });
    }
}

const addPayment = async (req, res) => {
    try {
        const { MemberID, CourseID, Type, Price } = req.body;
        const date = new Date()
        const dateString = date.toISOString().split('T')[0]
        const discount = 0.65

        if ( !MemberID || !CourseID || !Type  || !Price ) {
            return res.status(400).json({ error: 'MemberID, CourseID, Type and Price are required' });
        }
                
        const newPayment = {
            CourseID: CourseID,
            TotalAmount: (Type === "student") ? Price - (Price * discount) : Price,
            PayDate: dateString,
            Discount : (Type === "student") ? discount : 0
        };

        await dbo.collection("members").updateOne(
            { _id: MemberID }, 
            { $push: { Payments: newPayment } } 
        );

        res.status(201).json({ 
            message: 'Payment created successfully',
        });

    } catch (error) {
        console.error('Error creating enrollment:', error);
        res.status(500).json({ 
            error: 'Failed to create enrollment',
            details: error.message 
        });
    }
}

module.exports = { getMongoPrograms, addEnrollment, addPayment }