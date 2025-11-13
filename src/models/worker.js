const mongoose = require("mongoose");
const { type } = require("os");
const validator = require("validator");

const workerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email not valid");
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Invalid Gender");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    pincode: {
        type: String,
    },
    skills: {
        type: [String],
    },
    about: {
        type: String,
    },
    allJobs: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },

},
{
    timestamps: true
})

module.exports = mongoose.model("Worker", workerSchema);