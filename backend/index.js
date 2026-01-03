require("dotenv").config();
const express = require("express");
const db = require("./models");
const cors = require("cors");

const app = express();

const memberRouter = require("./routes/member");
const enrollmentRouter = require("./routes/enrollment");
const paymentRouter = require("./routes/payment");
const courseRouter = require("./routes/course");
const programRouter = require("./routes/program");

// Use Case 2
const tutorRouter = require("./routes/tutor");
const moduleRouter = require("./routes/module");

// NEW: seed route
const seedRouter = require("./routes/seed");

app.use(express.json());
app.use(cors());

app.use("/member", memberRouter);
app.use("/enrollment", enrollmentRouter);
app.use("/course", courseRouter);
app.use("/payment", paymentRouter);
app.use("/program", programRouter);

app.use("/tutors", tutorRouter);
app.use("/modules", moduleRouter);

// NEW: seed endpoint
app.use("/seed", seedRouter);

const port = Number(process.env.PORT || 3001);

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
