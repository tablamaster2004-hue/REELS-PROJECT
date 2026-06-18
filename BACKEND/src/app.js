const express = require("express");
const morgan = require("morgan");
const authRouter = require("./routes/auth.route");
const foodRouter = require("./routes/food.routes")
const cookieParser = require("cookie-parser");
const cors = require('cors')
const foodPartnerRoutes = require("../src/routes/food_partner.routes")

const app = express();

app.use(cors({
    origin: ['http://localhost:5173',"https://reels-project-eight.vercel.app"],
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/food", foodRouter);
app.use("/api/food-partner",foodPartnerRoutes)

module.exports = app;