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
    const {
      cart,
      address,
      phoneNumber,
      receiverName,
      paymentMethod,
      paymentStatus,
      status,
      receivedDate,
      estimatedDeliveryDate,
      deliveryMethod,
      deliveryCharges,
    } = body;

    const newOrder = new Order({
      cart,
      address,
      phoneNumber,
      receiverName,
      paymentMethod,
      paymentStatus,
      status,
      receivedDate,
      estimatedDeliveryDate,
      deliveryMethod,
      deliveryCharges,
      user: user._id,
    });

    const returedOrder = await newOrder.save();
    user.orders = user.orders.concat(returedOrder._id);
    await user.save();
    return response.status(201).json(returedOrder);
  } catch (err) {
    next(err);
  }
});

module.exports = orderRouter;
