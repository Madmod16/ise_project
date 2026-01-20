const express = require("express");
const db = require("./models");
const mongodb = require("./mongoDB");
const cors = require("cors");

const memberRouter = require("./routes/member");
const enrollmentRouter = require("./routes/enrollment");
const paymentRouter = require("./routes/payment");
const courseRouter = require("./routes/course");
const programRouter = require("./routes/program");
const mongodbRouter = require("./routes/mongodb");
const seedRouter = require("./routes/seed");
const tutorRouter = require("./routes/tutor");
const moduleRouter = require("./routes/module");


const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json());
app.use(cors());

app.use("/seed", seedRouter);
app.use("/tutors", tutorRouter); 

app.use("/member", memberRouter);
app.use("/enrollment", enrollmentRouter);
app.use("/course", courseRouter);
app.use("/payment", paymentRouter);
app.use("/program", programRouter);
app.use("/mongodb", mongodbRouter);
app.use("/module", moduleRouter);

async function startServer() { 
    try {
        await mongodb.connectToServer();

        await db.sequelize.sync();

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error("Failed to connect to DB", err);
        process.exit(1);
    }
}

const gracefulShutdown = async () => {
    console.log("Closing DB connection...");
    await db.closeConnection();
    process.exit(0);
};

startServer();
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
