const config = require("./utils/config");
const express = require("express");
const mongoose = require("mongoose");
const passport = require('passport');
const cors = require("cors");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const productsRouter = require("./controllers/products");
const reviewsRouter = require("./controllers/reviews");
const notificationRouter = require("./controllers/notification");
const orderRouter = require("./controllers/orders");
const stockRouter = require("./controllers/stocks")
const cartRouter = require("./controllers/carts")

const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/google/plantme",
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
},
  function (accessToken, refreshToken, profile, cb) {
    console.log(profile)
    return
  }
));

// passport.serializeUser(function (user, cb) {
//   process.nextTick(function () {
//     cb(null, { id: user.id, username: user.username, name: user.name });
//   });
// });

// passport.deserializeUser(function (user, cb) {
//   process.nextTick(function () {
//     return cb(null, user);
//   });
// });


const app = express()

app.use(cors());
app.use(express.static("build"));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }))
app.use(middleware.requestLogger);

app.use("/api/users", middleware.tokenExtractor, userRouter);
app.use("/api/login", loginRouter);
app.use("/api/products", middleware.tokenExtractor, productsRouter);
app.use("/api/reviews", middleware.tokenExtractor, reviewsRouter);
app.use("/api/notification", middleware.tokenExtractor, notificationRouter);
app.use("/api/orders/", middleware.tokenExtractor, orderRouter);
app.use("/api/stocks", middleware.tokenExtractor, stockRouter)
app.use("/api/carts", middleware.tokenExtractor, cartRouter)
app.use("/photos", express.static("photos"));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/plantme', passport.authenticate('google'));

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
