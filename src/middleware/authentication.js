// this is the authenticatiion file for the login
const passport = require("passport");
require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/callback",
    },
    // we will get the values accessToken,refreshToken after successfull login
    async function (accessToken, refreshToken, profile, cb) {
      try {
        console.log('profile',profile)
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          return cb(null, existingUser);
        }
        const newUser = new User({
            googleId: profile.id,
            name: profile.displayName, // Ensure 'displayName' exists in the profile object
        });
        
        await newUser.save();
        return cb(null, newUser);
      } catch (err) {
        console.log(err);
        return cb(err);
      }
    }
  )
);

// this will persist the userId inside the session object
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// this will retrieve the user object from the session object by its id
passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        if (!user) return done(null, false);
        return done(null, user); // Make sure 'user' has the 'name' field
    } catch (err) {
        return done(err);
    }
});
