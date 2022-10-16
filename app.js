const config = require("./utils/config");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieSession = require("cookie-session");
const cors = require("cors");

const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const productsRouter = require("./controllers/products");
const reviewsRouter = require("./controllers/reviews");
const notificationRouter = require("./controllers/notification");
const orderRouter = require("./controllers/orders");
const stockRouter = require("./controllers/stocks");
const cartRouter = require("./controllers/carts");
const authRouter = require("./controllers/auth");
const addressRouter = require("./controllers/addresses");
const passwordResetRouter = require("./controllers/passwordReset");

const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

const app = express();

app.use(cors());
app.use(express.static("build"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(middleware.requestLogger);

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/products", productsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/notification", middleware.tokenExtractor, notificationRouter);
app.use("/api/orders/", middleware.tokenExtractor, orderRouter);
app.use("/api/stocks", stockRouter);
app.use("/api/carts", middleware.tokenExtractor, cartRouter);
app.use("/api/addresses", middleware.tokenExtractor, addressRouter);
app.use("/api/password-reset", passwordResetRouter);
app.use("/api/auth", authRouter);
app.use("/photos", express.static("photos"));

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
