const mongodb = require("mongodb")
const url = "mongodb+srv://hriazinivan_db_user:160604@cluster0.5j4quiy.mongodb.net/?appName=Cluster0"
const client = new mongodb.MongoClient(url)
let dbConnection

const connectToServer = async () => {
        if (!dbConnection) {
            await client.connect();
            dbConnection = client.db('your_database_name');
            console.log("Successfully connected to MongoDB.");
        }
        return dbConnection;
    }

const getDb = () => {return client.db("test");}

const closeConnection = async () => {
        await client.close();
    }


module.exports = {connectToServer, getDb, closeConnection}