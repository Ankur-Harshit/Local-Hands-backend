const validateUserData = require("../utils/validation");
const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Worker = require("../models/worker");
const { sendOtpEmail, verifyOtp } = require("../utils/sendOtp");

authRouter.post("/request-otp", async(req, res)=>{
    try{
        const { email } = req.body;
        if (!email) return res.status(400).send("Email is required");
        if(!validator.isEmail(email)){
            throw new Error("Please Enter a valid Email");
        }
        await sendOtpEmail(email);
        res.send("OTP sent successfully");
    }
    catch(err){
        res.status(404).send("Error sending Email");
    }
})

authRouter.post("/signup-user", async(req,res)=>{
    try{
        validateUserData(req);
        const {firstName, lastName, email, password, otp} = req.body;
        const verified = await verifyOtp(email, otp);
        if(!verified) return res.status(400).send("Invalid or expired OTP");
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
        });
        await newUser.save();
        res.send("Sign Up User Successful");
    }
    catch(err){
        res.status(400).send(err.message);
    }
});

authRouter.post("/login-user", async(req,res)=>{
    try{
        const {email, password} = req.body;
        if(email !== email.toLowerCase()){
            throw new Error("Email should be in lowercase only.");
        }
        if(!validator.isEmail(email)){
            throw new Error("Please Enter a valid Email");
        }
        const user = await User.findOne({email : email});
        if(!user){
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            const token = await jwt.sign({_id: user._id, role:"user"}, "DEV@Tinder$790", 
                {expiresIn: "1d"}
            );
            res.cookie("token", token);
            res.send(user);
        }
        else{
            throw new Error("Invalid credentials");
        }
    }
    catch(error){
        res.status(400).send(error.message);
    }
});

authRouter.post("/signup-worker", async(req,res)=>{
    try{
        validateUserData(req);
        const {firstName, lastName, email, password, otp} = req.body;
        const verified = await verifyOtp(email, otp);
        if(!verified) return res.status(400).send("Invalid or expired OTP");
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new Worker({
            firstName,
            lastName,
            email,
            password: passwordHash,
        });
        await newUser.save();
        res.send("Sign Up Worker Successful");
    }
    catch(err){
        res.status(400).send(err.message);
    }
});

authRouter.post("/login-worker", async(req,res)=>{
    try{
        const {email, password} = req.body;
        if(email !== email.toLowerCase()){
            throw new Error("Email should be in lowercase only.");
        }
        if(!validator.isEmail(email)){
            throw new Error("Please Enter a valid Email");
        }
        const worker = await Worker.findOne({email : email});
        if(!worker){
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, worker.password);
        if(isPasswordValid){
            const token = await jwt.sign({_id: worker._id, role:"worker"}, "DEV@Tinder$790", 
                {expiresIn: "1d"}
            );
            res.cookie("token", token);
            res.send(worker);
        }
        else{
            throw new Error("Invalid credentials");
        }
    }
    catch(error){
        res.status(400).send(error.message);
    }
});

authRouter.post("/logout", async(req, res)=>{
    res.cookie("token", null, {
        expires : new Date(Date.now()),
    });
    res.send("Logout Successful");
});

module.exports = authRouter;