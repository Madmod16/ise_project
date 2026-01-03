const express = require("express");
const db = require('./models');
const mongodb = require('./mongoDB');
const app = express()
const cors = require('cors')
const memberRouter = require('./routes/member')
const enrollmentRouter = require('./routes/enrollment')
const paymentRouter = require('./routes/payment')
const courseRouter = require('./routes/course')
const programRouter = require('./routes/program')
const mongodbRouter = require('./routes/mongodb')

async function startServer() {
    try {
        await mongodb.connectToServer();
        db.sequelize.sync().then(() =>{
            app.listen(3001, () => {
                console.log("Server running on port 3001")
            })
        })
    } catch (err) {
        console.error("Failed to connect to DB", err);
        process.exit();
    }
}

const gracefulShutdown = async () => {
    console.log("Closing DB connection...");
    await db.closeConnection();
    process.exit(0);
};

app.use(express.json());
app.use(cors());

app.use('/member', memberRouter);
app.use('/enrollment', enrollmentRouter);
app.use('/course', courseRouter);
app.use('/payment', paymentRouter);
app.use('/program', programRouter);
app.use('/mongodb', mongodbRouter);

db.sequelize.sync().then(() =>{
    app.listen(3001, () => {
        console.log("Server running on port 3001")
    })
})

startServer();
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
