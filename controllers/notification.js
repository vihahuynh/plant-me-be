const notificationRouter = require("express").Router();
const Notification = require("./../models/notification");

notificationRouter.post("/:id", async (request, response, next) => {
  try {
    const newNoti = new Notification({
      text: request.body.text,
    });
    await newNoti.save();
  } catch (err) {
    next(err);
  }
});

module.exports = notificationRouter;
