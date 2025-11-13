const validator = require("validator");

const validateUserData = (req)=>{
    const {password, pincode} = req.body;
    if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter a Strong Password");
    }
}

module.exports = validateUserData;