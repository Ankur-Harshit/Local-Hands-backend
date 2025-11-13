require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user");
const workerRouter = require("./routes/worker");
const cors = require('cors');

app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
};
app.use(cors(corsOptions));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", workerRouter);


connectDB().then(()=>{
    console.log("Connected to DB");
    app.listen(3000, ()=>{
        console.log("Server is successfuly listening on port: 3000");
    })
}).catch((err)=>{
    console.log(err);
});