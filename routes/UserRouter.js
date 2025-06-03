const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

router.post("/", async (request, response) => {
  
});

router.get("/list", async (request, response) => {
    try{
        const users = await User.find({}, "_id first_name last_name")
        response.status(200).json(users);
    }catch(e){
        response.status(500).json({message: "Error with serrver", error: e});
        console.error(e);
    }
});

router.get("/:id", async (request, response) => {
    try{
        const {id} = request.params
        const user = await User.findById(id)
        if(!user){
            response.status(400).json({message: "User not found!"})
        }else response.status(200).json(user);
    }catch(e){
        response.status(400).json({message: "User not found!"})
        console.error(e);
    }
});



module.exports = router;