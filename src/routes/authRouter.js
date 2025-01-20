const User = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

// we have to require middleware
require("../middleware/authentication");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/auth/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/logged",
  })
);

router.get("/logged", function (req, res) {
  if (req.isAuthenticated()) {
    console.log("Authenticated User:", req.user); // Log the full user object
    res.render("logged", {
      name: req.user.name,
    });
  } else {
    res.send("You are not logged in!");
  }
});

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("User logged out!");
    res.redirect("/login");
  });
});

module.exports = router;
