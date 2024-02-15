const express = require("express");
const path = require("path");
const nocache = require("nocache");
const bcrypt = require("bcrypt");
const userauthRoute = require("./routes/userAuth");
const userfeatRoute = require("./routes/userfeat");
const adminfeatRoute = require("./routes/adminfeat");

const session = require("express-session"); 

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Login-sam");

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
})

mongoose.connection.on("error", (err) => {


  console.log("Error connecting to MongoDB");
})

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
})




const app = express();
const PORT = 3002;

app.use(express.urlencoded({ extended: true })); 
app.use("/public", express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "12dwvgjad234",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/", nocache());

app.use("/", userauthRoute);
app.use("/userhome", userfeatRoute);
app.use("/adminhome", adminfeatRoute);
app.use('*',(req,res)=>{
 res.status(404).send('404')
})
app.listen(PORT, () => {
  console.log("Server started on http://localhost:3002");
});


