const validator = require("validator");
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "assigned", "in-progress", "atLocation", "paymentDone", "completed", "cancelled"],
        default: "pending",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Worker",
        }
    ],
    assignedWorker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
    },
    address: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    payment: {
        status: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
    },
    rating: {
        userToWorker: { type: Number, min: 1, max: 5 },
        workerToUser: { type: Number, min: 1, max: 5 },
        review: String,
    },
},
{
    timestamps: true,
})

module.exports = mongoose.model("Job",jobSchema);