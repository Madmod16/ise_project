const express = require("express");
const pool = require('./db');
const db = require('./models');
const app = express()
const cors = require('cors')

app.use(express.json());
app.use(cors());

const memberRouter = require('./routes/member')
app.use('/member', memberRouter);

db.sequelize.sync().then(() =>{
  app.listen(3001, () => {
    console.log("Server running on port 3001")
  })
})



