const express = require("express");
const router = express.Router()
const { Member } = require('../models')

router.get("/", async (req, res) =>{
    const listOfPosts = await Member.findAll()
    res.send(listOfPosts)
})

router.post("/", async (req, res) =>{
    const member = req.body
    await Member.create(member)
    res.send(member)
})


module.exports = router