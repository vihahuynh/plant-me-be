const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const productsRouter = require("./controllers/products");
const reviewsRouter = require("./controllers/reviews");
const notificationRouter = require("./controllers/notification");
const orderRouter = require("./controllers/orders");
const stockRouter = require("./controllers/stocks")

const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

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
app.use("/api/stocks", stockRouter)
app.use("/photos", express.static("photos"));

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
