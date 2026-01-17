const db = require("../mongoDB")
const dbo = db.getDb();

const getAnaliticsReport = async (req, res) => {
    const { ProgramId } = req.body;
    let query = { _id: ProgramId };
    try {
        const result = await dbo.collection('programs').aggregate([
            { 
                $match: query 
            },
            {
                $lookup: {
                    from: "members",
                    let: { programId: "$_id" }, 
                    pipeline: [
                        {
                            $match:{
                                type:"student"
                            }
                        },
                        {
                            $match: {
                                $expr: { $in: ["$$programId", "$Enrollments.ProgramID"] }
                            }
                        },
                        { $unwind: "$Enrollments" },
                        {
                            $match: {
                                $expr: { $eq: ["$Enrollments.ProgramID", "$$programId"] }
                            }
                        },
                        {
                            $lookup: {
                                from: "courses",
                                localField: "Enrollments.CourseID",
                                foreignField: "_id",
                                as: "course_details"
                            }
                        },
                        { $unwind: "$course_details" },
                        {
                            $group: {
                                _id: "$_id",
                                name: { $first: "$member" },
                                student_data: { $first: "$student" },
                                total_paid: { $sum: "$Enrollments.Payment.Amount" },
                                enrolled_courses: { $push: "$course_details" }
                            }
                        }
                    ],
                    as: "students_in_program"
                }
            }
        ]).toArray();

        console.log(result);
        res.status(200).json(result);
        
    } catch (error) {
        console.error("Error fetching programs:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { getAnaliticsReport }