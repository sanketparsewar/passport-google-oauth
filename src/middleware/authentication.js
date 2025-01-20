// this is the authenticatiion file for the login
const passport = require("passport");
LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ username: username });
      if (!user) return done(null, false, { message: "Incorrect username" });

      const isMatch = await bcrypt.compareSync(password, user.password);
      if (!isMatch) return done(null, false, { message: "Incorrect password" });

      return done(null, user);
    } catch (err) {
      console.error(err);
      return done(err);
    }
  })
);

// this will persist the userId inside the session object
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// this will retrieve the user object from the session object by its id
passport.deserializeUser(async function (id, done) {
  const user = await User.findById(id);
  if (!user) return done(err);
  return done(null, user);
});
