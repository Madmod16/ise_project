const db = require("../mongoDB")
const dbo = db.getDb();

const getMongoTutors = async (req, res) =>{
    try {
        const result = await dbo.collection('tutors').find({}).toArray();

        console.log(result);

        res.status(200).json(result);

        return result;
    } catch (error) {
        console.error("Error fetching tutors:", error);
        res.status(500).send("Internal Server Error");
    }
};



module.exports = { getMongoTutors }