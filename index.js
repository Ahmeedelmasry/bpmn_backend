//Settings
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//Routes
const signupRoute = require("./routes/auth/auth");
const diagramRoute = require("./routes/diagrams/diagrams");

//Create our express app
const app = express();

//Handle Cors and Middleware
app.use((req, res, next) => {
  res
    .header("Access-Control-Allow-Origin", 'https://bpmnproject-9be05.web.app')
    .header("Access-Control-Allow-Methods", "GET, POST, HEAD, PUT, DELETE")
    .header(
      "Access-Control-Allow-Headers",
      "auth-token, Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
    .header("Access-Control-Allow-Credentials", true);
  next();
});

//Config
app.use(bodyParser.json());

//Make Static Photos Available
app.use(express.static("profileImgs"));

//Database Stuff
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo Db Connected .."))
  .then(() => {
    //Starting server
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Listining at port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => console.log(err));

//Main App Route
app.get("/", (req, res) => {
  res.send({ message: "Hello World" });
});

//User Routes
app.use("/auth", signupRoute);
app.use("/diagrams", diagramRoute);
