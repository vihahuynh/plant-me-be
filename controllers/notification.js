/* eslint-disable no-prototype-builtins */
const notificationRouter = require("express").Router();
const Notification = require("./../models/notification");
const Order = require("./../models/order");

notificationRouter.get("/", async (request, response, next) => {
  try {
    const { sortBy, limit, skip, ...filters } = request.query;
    const user = request.user;
    const sorts = sortBy?.split(":") || "createdAt:desc".split(":");
    if (user?.id === filters.user || user.isAdmin) {
      const allNotification = await Notification.find(filters);
      const notification = await Notification.find(filters)
        .sort([[sorts[0], sorts[1] === "desc" ? -1 : 1]])
        .limit(limit)
        .skip(skip);
      return response.json({
        notification,
        totalPages: Math.ceil(allNotification.length / parseInt(limit)),
      });
    }
    return response.status(403).json({ err: "permission denied" });
  } catch (err) {
    next(err);
  }
});

const saveNoti = async (notiData) => {
  const newNoti = new Notification(notiData);
  const returnedNoti = await newNoti.save();
  return returnedNoti;
};

notificationRouter.post("/", async (request, response, next) => {
  try {
    const { body } = request;
    if (body?.order) {
      const order = await Order.findById(body.order);
      if (order?.user.toString() === body?.user) {
        const returnedNoti = await saveNoti(body);
        return response.json(returnedNoti);
      } else {
        return response.status(400).json({ err: "wrong userId or orderId" });
      }
    }
    const returnedNoti = await saveNoti(body);
    response.status(201).json(returnedNoti);
  } catch (err) {
    next(err);
  }
});

notificationRouter.patch("/:id", async (request, response, next) => {
  try {
    const { body } = request;
    const id = request?.params?.id;

    const user = request.user;
    const noti = await Notification.findById(id);

    if (user?.id !== noti?.user.toString()) {
      response.status(403).json({ err: "permission denied" });
    }

    if (!noti) {
      response.status(404).json({ message: "No notification found" });
    }
    const updatedNoti = await Notification.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    response.json(updatedNoti);
  } catch (err) {
    next(err);
  }
});

module.exports = notificationRouter;
