const express = require("express");
const router = express.Router()
const { Member1 } = require('../models')

router.get("/", async (req, res) =>{
    const listOfPosts = await Member1.findAll()
    res.send(listOfPosts)
})

router.post("/", async (req, res) =>{
    const member = req.body
    await Member1.create(member)
    res.send(member)
})


module.exports = router