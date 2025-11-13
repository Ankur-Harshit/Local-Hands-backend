const express = require("express");
const workerRouter = express.Router();
const User = require("../models/user");
const Worker = require("../models/worker");
const Job = require("../models/job");
const mixAuth = require("../middlewares/auths");
const mongoose = require("mongoose");

workerRouter.get("/worker/jobs/available", mixAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 6;
    const skip = (page-1)*limit;
    if(limit>50) limit = 50;
    if (req.role == "user") {
      throw new Error("Unauthorised Access");
    }
    const userId = req.user._id;
    const jobs = await Job.find({
      status: "pending",
      pincode: req.user.pincode,
    }).skip(skip).limit(limit);;
    res.send(jobs);
  } catch (err) {
    res.status(404).send(err);
  }
});

workerRouter.post("/worker/jobs/apply/:jobId", mixAuth, async (req, res) => {
  try {
    if (req.role == "user") {
      throw new Error("Unauthorised Access");
    }
    // console.log("TYPE OF req.user._id:", typeof req.user._id);
    const jobId = req.params.jobId;
    const job = await Job.findOne({
      _id: jobId,
      status: "pending",
    });
    if (!job || job.length === 0) {
      throw new Error("Job does not exist");
    }
    if (job.applications.includes(req.user._id)) {
      throw new Error("Application already exists");
    }
    job.applications.push(req.user._id);
    await job.save({ validateBeforeSave: false });
    res.send("Successfully Applied");
  } catch (err) {
    res.status(404).send(err.message);
  }
});

workerRouter.get("/worker/jobs/ongoing", mixAuth, async (req, res) => {
  try {
    if (req.role == "user") {
      throw new Error("Unauthorised Access");
    }
    const userId = req.user._id;
    const jobs = await Job.find({
      assignedWorker: userId,
      status: { $in: ["assigned", "atLocation", "completed"] },
    }).populate("user");
    res.send(jobs);
  } catch (err) {
    res.status(404).send(err);
  }
});

workerRouter.post("/worker/jobs/payment/:jobId", mixAuth, async (req, res) => {
  try {
    if (req.role == "user") {
      throw new Error("Unauthorised Access");
    }
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error("Job Does not exist");
    }
    job.payment.status = "paid";
    job.status = "paymentDone";
    await job.save({ validateBeforeSave: false });
    res.send("Payment Successful");
  } catch (err) {
    res.status(404).send(err);
  }
});

workerRouter.post("/worker/update/:jobId/:newStatus", mixAuth, async (req, res) => {
  try {
    if (req.role == "user") {
      throw new Error("Unauthorised Access");
    }
    const jobId = req.params.jobId;
    const newStatus = req.params.newStatus;
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error("Job Does not exist");
    }
    job.status = newStatus;
    await job.save({ validateBeforeSave: false });
    res.send("Update Successful");
  } catch (err) {
    res.status(404).send(err);
  }
});

workerRouter.get("/worker/history", mixAuth, async(req, res)=>{
    try {
    if (req.role == "user") {
      throw new Error("Unauthorised Access");
    }
    const userId = req.user._id;
    const job = await Job.find({
        assignedWorker: userId,
    })
    res.send(job);
  } catch (err) {
    res.status(404).send(err);
  }
})

workerRouter.get("/worker/jobs/search", mixAuth, async(req, res)=>{
  try {
    if (req.role == "user") {
      throw new Error("Unauthorised Access");
    }
    const query = req.query.query || "";
      const jobs = await Job.find({
        pincode: req.user.pincode,
        $or: [
          {title: {$regex: query, $options: "i"}},
          {description: { $regex: query, $options: "i" }},
          {category: { $regex: query, $options: "i" }},
        ],
      });
    res.send(jobs);
  } catch (err) {
    res.status(404).send(err);
  }
})

module.exports = workerRouter;
