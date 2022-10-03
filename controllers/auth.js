const authRouter = require("express").Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./../models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/google/plantme",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
        });
        if (!user) {
          const newUser = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName,
            avatarUrl: profile.photos[0].value,
          });
          const returnedUser = await newUser.save();
          return cb(null, returnedUser);
        }
        return cb(null, user);
      } catch (err) {
        console.log(err);
      }
    }
  )
);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get("/google/plantme", passport.authenticate("google"));

module.exports = authRouter;
