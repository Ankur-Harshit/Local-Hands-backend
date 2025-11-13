const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const Worker = require("../models/worker");
const Job = require("../models/job");
const mixAuth = require("../middlewares/auths");
const rateLimiter = require("../middlewares/rateLimiter");
const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");

userRouter.post("/user/job/create", mixAuth, rateLimiter(1,120), async(req,res)=>{
    try{
        if(req.role==='worker'){
            throw new Error("Unauthorised Access");
        }
        const user_id = req.user._id;
        const {title, description, category, price, address, pincode} = req.body;
        const newJob = new Job({
            title,
            description,
            category,
            price,
            user:user_id,
            address,
            pincode,
        });
        await newJob.save();
        const emailRes = await sendEmail.run();
        console.log(emailRes);
        res.send(newJob);
    }
    catch(err){
        res.status(404).send(err);
    }
});

userRouter.get("/user/job/pending", mixAuth, async(req,res)=>{
    try{
        if(req.role==="worker"){
            return res.status(401).send("Unauthorised Access!");
        }
        const user_id = req.user._id;
        const ongoingJobs = await Job.find({
            user: user_id,
            status: "pending",
        }).populate("applications");
        res.send(ongoingJobs);
    }
    catch(err){
        res.status(404).send(err);
    }
});

userRouter.get("/user/job/applied/:jobId", mixAuth, async(req,res)=>{
    try{
        if(req.role==="worker"){
            return res.status(401).send("Unauthorised Access!");
        }
        const user_id = req.user._id;
        const jobId = req.params.jobId;
        const job = await Job.findOne({_id: jobId}).populate("applications");
        if(job.user.toString() != user_id.toString()){
        throw new Error("Unauthourised Access!")
        }
        const appliedList = job.applications;
        res.send(appliedList);
    }
    catch(err){
        res.status(404).send(err);
    }
});

userRouter.post("/user/job/assign/:jobId/:workerId", mixAuth, async(req, res)=>{
    try{
        if(req.role==="worker"){
            return res.status(401).send("Unauthorised Access!");
        }
        const user_id = req.user._id;
        const jobId = req.params.jobId;
        const workerId = req.params.workerId;
        const user = await User.findOne({_id: user_id});
        const job = await Job.findOne({_id: jobId});
        const worker = await Worker.findOne({_id: workerId});
        user.allJobs.push(jobId);
        await user.save();
        job.assignedWorker = workerId;
        job.status = "assigned";
        await job.save();
        worker.allJobs.push(jobId);
        await worker.save();
        res.send(job);
    }
    catch(err){
        res.status(404).send(err);
    }
});

userRouter.get("/user/job/assigned", mixAuth, async(req, res)=>{
    try{
        if(req.role==="worker"){
            return res.status(401).send("Unauthorised Access!");
        }
        const user_id = req.user._id;
        const assignedJobs = await Job.find({
            user: user_id,
            status: { $in: ["assigned", "atLocation", "completed"] },
        }).populate("assignedWorker");
        res.send(assignedJobs);
    }
    catch(err){
        res.status(404).send(err);
    }
});

userRouter.get("/user/job/history", mixAuth, async(req, res)=>{
    try{
        if(req.role==="worker"){
            return res.status(401).send("Unauthorised Access!");
        }
        const user_id = req.user._id;
        const user = await User.findOne({
            _id: user_id,
        }).populate({
            path: "allJobs",
            populate: {
                path: "assignedWorker",
                model: "Worker"
            }
        });
        res.send(user);
    }
    catch(err){
        res.status(404).send(err);
    }
});

module.exports = userRouter;