const db = require("../mongoDB")
const dbo = db.getDb();

const getAnaliticsReport = async (req, res) =>{
    try {
        const result = await dbo.collection('members').toArray();
        
        console.log(result);
        
        res.status(200).json(result); 
        
        return result;
    } catch (error) {
        console.error("Error fetching programs:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { getAnaliticsReport }