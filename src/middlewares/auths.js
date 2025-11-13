const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Worker = require("../models/worker");

const mixAuth = async(req, res, next)=>{
    try {
            const cookies = req.cookies;
            const { token } = cookies;
            if(!token){
                return res.status(401).send("Login again!");
            }
    
            const decodedMessage = jwt.verify(token, "DEV@Tinder$790");
            const { _id, role } = decodedMessage;
            let user;
            if(role=='user'){
                user = await User.findById(_id);
            }
            else if(role=='worker'){
                user = await Worker.findById(_id);
            }
            else if(!user){
                throw new Error("User does Not exist");
            }
            else{
                throw new Error("User does Not exist");
            }
            req.user = user;
            req.role = role;
            next();
        }
        catch(error){
            res.status(400).send(error.message);
        }
}

module.exports = mixAuth;