const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6001;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

//gearstream
//BEgw3N1lc3Y1teP1

//mongodb config using mongoose
mongoose
  .connect(
    "mongodb+srv://gearstream:BEgw3N1lc3Y1teP1@gearstream-cluster.lbdoaum.mongodb.net/gearstream?retryWrites=true&w=majority&appName=gearstream-cluster"
  )
  .then(console.log("MongoDB connected Successfully!"))
  .catch((error) => console.log("Error connecting to MongoDB", error));

//jwt authentication

app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1hr",
  });
  res.send({ token });
});
 


//import routes

const gearRoutes = require("./api/routes/gearRoutes.js");
const reserveRoutes = require("./api/routes/reserveRoutes.js");
const userRoutes = require("./api/routes/userRoutes.js");
const rentedRoutes = require("./api/routes/rentedRoutes.js");
app.use("/gears", gearRoutes);
app.use("/reserves", reserveRoutes);
app.use("/users", userRoutes);
app.use("/rented", rentedRoutes);

app.get("/", (req, res) => {
  res.send("Hello Gearstream server!");
});

app.listen(port, () => {
  console.log(`Gear app listening on port ${port}`);
});

