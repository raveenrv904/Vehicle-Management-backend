require("dotenv").config();
require("express-async-errors");

// express
const express = require("express");
const app = express();

// Cors
const cors = require("cors");
// Body Parser
const bodyParser = require("body-parser");

// Other Packages
const cookieParser = require("cookie-parser");

// MongoDB
const { connectDB } = require("./db/connectDB");

// Router
const authRouter = require("./routes/AuthRoute");
const userRouter = require("./routes/UserRoute");
const dealerRouter = require("./routes/DealershipRoute");
const commonRouter = require("./routes/CommonRoute");

app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/dealers", dealerRouter);
app.use("/api/v1/common", commonRouter);

app.get("*", (req, res) => {
  res.send("Page NoT Found");
});

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is LIstening on port: ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
