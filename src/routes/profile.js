const User = require("../models/user");
const Worker = require("../models/worker");
const mixAuth = require("../middlewares/auths");
const express = require("express");
const profileRouter = express.Router();

profileRouter.get("/profile", mixAuth, async(req, res)=>{
    try{
        const user = req.user;
        const role = req.role;
        res.send({user, role});
    }
    catch(err){
        res.status(400).send(err);
    }
});

profileRouter.patch("/profile/edit", mixAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        res.send({data: loggedInUser,
            message: "Profile Updated",
        });
    }
    catch(err){
        res.status(400).send(err);
    }
});

module.exports = profileRouter;