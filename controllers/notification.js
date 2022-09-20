const notificationRouter = require("express").Router();
const Notification = require("./../models/notification");

notificationRouter.post("/:id", async (request, response, next) => {
  try {
    const newNoti = new Notification({
      text: request.body.text,
      user: request.body.user,
      isRead: {
        type: Boolean,
        default: false,
      },
      show: {
        type: Boolean,
        default: true,
      },
    });
    await newNoti.save();
  } catch (err) {
    next(err);
  }
});

module.exports = notificationRouter;
