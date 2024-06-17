import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import passport from './middleware/Passport.js';
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import portfolioRoute from "./routes/portfolio.route.js";
import reviewRoute from "./routes/review.route.js";
import cookieparser from "cookie-parser"
import cors from "cors";

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());



const connect = async() => {
    try {
        await mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true });;
        console.log("Connected to mongoDB!");
    } catch (error) {
        console.log(error);
    }
};




app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use(express.json());
app.use(cookieparser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/portfolios", portfolioRoute);
app.use("/api/reviews", reviewRoute);


app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";

    return res.status(errorStatus).send(errorMessage);
});

app.listen(8800, () => {
    connect();
    console.log("Backend server is running!");
});