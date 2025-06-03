const express = require('express')
const User = require('../db/userModel')
const router = express.Router()

router.post("/register", async (req, res)=>{
    const {first_name, last_name, username, password, location, description, occupation} = req.body;
    try{
        if(!first_name || !last_name || !username || !password || !location || !description || !occupation){
            return res.status(400).json({message: "All fields are required!"});
        }
        const user = await User.findOne({username});
        if(user){
            return res.status(400).json({message: "Username has been used!"});
        } 
        const newUser = new User({first_name, last_name, username, password, location, description, occupation});
        await newUser.save();
        res.status(201).json(newUser);
    }catch(e){
        res.status(400).json({message: "Something error in server", e})
    }
});

router.post("/login", async (req, res)=>{
    const {username, password} = req.body;
    try{
        const user = await User.findOne({username, password});
        if(!user){
            return res.status(400).json({message: "Wrong username or password!"});
        }
        res.status(200).json(user);
    }catch(e){
        res.status(400).json({message: "Something error in server", e});
    }
});

module.exports = router;