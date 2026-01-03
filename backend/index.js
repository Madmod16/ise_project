require("dotenv").config();
const express = require("express");
const db = require("./models");
const cors = require("cors");

const { seedOnStartupRandom } = require("./controllers/seedController");

const app = express();

const memberRouter = require("./routes/member");
const enrollmentRouter = require("./routes/enrollment");
const paymentRouter = require("./routes/payment");
const courseRouter = require("./routes/course");
const programRouter = require("./routes/program");

// Use Case 2 route
const tutorRouter = require("./routes/tutor");
const moduleRouter = require("./routes/module");

app.use(express.json());
app.use(cors());

app.use("/member", memberRouter);
app.use("/enrollment", enrollmentRouter);
app.use("/course", courseRouter);
app.use("/payment", paymentRouter);
app.use("/program", programRouter);

// Use Case 2 endpoint
app.use("/tutors", tutorRouter);
app.use("/modules", moduleRouter);

const port = Number(process.env.PORT || 3001);

db.sequelize
    .sync()
    .then(async () => {
        // ✅ jedes Start: alte Daten löschen + random neu einfügen
        await seedOnStartupRandom({ reset: true });

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Startup failed:", err);
        process.exit(1);
    });

const seedRouter = require("./routes/seed");
app.use("/seed", seedRouter);