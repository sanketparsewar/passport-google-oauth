const User = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

// we have to require middleware
require("../middleware/authentication")

router.get("/", function (req, res) {
  res.redirect("/register");
});

router.get("/register", function (req, res) {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ username: username });
    if (user) return res.send({ message: "User already registered" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", { successRedirect: "logged" })
);

router.get("/logged", function (req, res) {
  if (req.isAuthenticated()) {
    res.send("You are logged in!");
  } else {
    res.send("You are not logged in!");
  }
});

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
