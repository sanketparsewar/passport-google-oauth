const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const session = require("express-session");
const authRouter = require("./routes/authRouter");
const MongoStore = require("connect-mongo");
const passport = require("passport");

const app = express();
const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("mongodb connection");
  })
  .catch(() => {
    console.log("mongodb connection error");
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

// here we have to configure the session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), // Use connect-mongo session store. This is required for persistent sessions.
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 days this is the expiration of the cookie
    },
  })
);

// initialize the session
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRouter);

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
