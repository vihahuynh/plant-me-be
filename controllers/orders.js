const orderRouter = require("express").Router();
const Order = require("./../models/order");
const User = require("./../models/user");
const jwt = require("jsonwebtoken");

orderRouter.get("/", async (request, response, next) => {
  try {
    const { query } = request;
    const decodedToken = request.token
      ? jwt.verify(request.token, process.env.SECRET)
      : null;

    if (!decodedToken?.id) {
      return response.status(401).json({ err: "token missing or invalid" });
    }
    const user = await User.findById(decodedToken.id);
    if ((query?.user && query.user === user.id) || user?.isAdmin) {
      const orders = await Order.find(query);
      return response.json(orders);
    }
    return response.status(403).json({ err: "permission denied" });
  } catch (err) {
    next(err);
  }
});

orderRouter.get("/:id", async (request, response, next) => {
  try {
    const decodedToken = request.token
      ? jwt.verify(request.token, process.env.SECRET)
      : null;

    if (!decodedToken?.id) {
      return response.status(401).json({ err: "token missing or invalid" });
    }
    const user = await User.findById(decodedToken.id);
    const order = await Order.findById(request.params.id).populate(
      "notification"
    );

    if (order?.user.toString() === user?.id || user.isAdmin) {
      return response.json(order);
    }
    if (!order) {
      return response.status(404).json({ message: "No order found" });
    }
    return response.status(403).json({ err: "permission denied" });
  } catch (err) {
    next(err);
  }
});

orderRouter.post("/", async (request, response, next) => {
  try {
    const { body } = request;
    const decodedToken = request.token
      ? jwt.verify(request.token, process.env.SECRET)
      : null;

    if (!decodedToken?.id) {
      return response.status(401).json({ err: "token missing or invalid" });
    }
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response.status(402).json({ message: "No user found" });
    }

    const newOrder = new Order(body);

    const returedOrder = await newOrder.save();
    user.orders = user.orders.concat(returedOrder._id);
    await user.save();
    return response.status(201).json(returedOrder);
  } catch (err) {
    next(err);
  }
});

orderRouter.patch("/:id", async (request, response, next) => {
  try {
    const decodedToken = request.token
      ? jwt.verify(request.token, process.env.SECRET)
      : null;

    if (!decodedToken?.id) {
      return response.status(401).json({ err: "token missing or invalid" });
    }
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response.status(402).json({ message: "No user found" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true }
    );
    if (!updatedOrder) {
      return response.status(404).json({ message: "No order found" });
    }
    response.json(updatedOrder);
  } catch (err) {
    next(err);
  }
});

module.exports = orderRouter;
