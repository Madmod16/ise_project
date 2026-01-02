const express = require("express");
const db = require('./models');
const app = express()
const cors = require('cors')

//const memberRouter = require('./routes/member')
//const enrollmentRouter = require('./routes/enrollment')
//const paymentRouter = require('./routes/payment')
const courseRouter = require('./routes/course')
//const programRouter = require('./routes/program')

// Use Case 2 (version 1, weak entity): Tutor adds modules to their course
const tutorRouter = require("./routes/tutor");
const moduleRouter = require("./routes/module");

app.use(express.json());
app.use(cors());

//app.use('/member', memberRouter);
//app.use('/enrollment', enrollmentRouter);
app.use('/course', courseRouter);
//app.use('/payment', paymentRouter);
//app.use('/program', programRouter);

// Use Case 2 (version 1, weak entity): Tutor adds modules to their course
app.use("/tutors", tutorRouter);
app.use("/modules", moduleRouter);

db.sequelize.sync().then(() =>{
  app.listen(3001, () => {
    console.log("Server running on port 3001")
  })
})



