/* eslint-disable no-prototype-builtins */
const notificationRouter = require("express").Router();
const Notification = require("./../models/notification");
const Order = require("./../models/order");

notificationRouter.get("/", async (request, response, next) => {
  try {
    const { query } = request;
    const user = request.user
    if (user?.id === query.user || user.isAdmin) {
      const notification = await Notification.find(query);
      return response.json(notification);
    }
    return response.status(403).json({ err: "permission denied" });
  } catch (err) {
    next(err);
  }
});

notificationRouter.post("/", async (request, response, next) => {
  try {
    let newNoti;
    const { body } = request;
    const user = request.user
    if (body?.order) {
      const order = await Order.findById(body.order);
      if (order?.user.toString() === body?.user) {
        newNoti = new Notification({
          content: body.content,
          user: body.user,
          order: order._id.toString(),
        });
        const returnedNoti = await newNoti.save();
        if (order) {
          order.notification = order.notification.concat(returnedNoti._id);
          await order.save();
        }
        if (user) {
          user.notification = user.notification.concat(returnedNoti._id);
          await user.save();
        }
        return response.json(returnedNoti);
      } else {
        return response.status(400).json({ err: "wrong userId or orderId" });
      }
    }
    newNoti = new Notification({
      content: body.content,
      user: body.user,
    });
    const returnedNoti = await newNoti.save();
    if (user) {
      user.notification = user.notification.concat(returnedNoti._id);
      await user.save();
    }
    response.status(201).json(returnedNoti);
  } catch (err) {
    next(err);
  }
});

notificationRouter.patch("/:id", async (request, response, next) => {
  try {
    const { body } = request;
    const id = request?.params?.id;

    const user = request.user
    const noti = await Notification.findById(id);

    if (user?.id !== noti?.user.toString()) {
      response.status(403).json({ err: "permission denied" });
    }

    if (!noti) {
      response.status(404).json({ message: "No notification found" })
    }
    const updatedNoti = await Notification.findByIdAndUpdate(id, body, {
      new: true, runValidators: true
    });
    response.json(updatedNoti);
  } catch (err) {
    next(err);
  }
});

// notificationRouter.delete("/:id", async (request, response, next) => {
//   try {
//     const id = request?.params?.id;

//     const decodedToken = request.token
//       ? jwt.verify(request.token, process.env.SECRET)
//       : null;
//     if (!decodedToken?.id) {
//       return response.status(401).json({ err: "token missing or invalid" });
//     }
//     const user = await User.findById(decodedToken.id);
//     const noti = await Notification.findById(id);

//     if (!noti) response.status(201).json({ message: "done" });

//     if (user?.id !== noti?.user.toString()) {
//       response.status(403).json({ err: "permission denied" });
//     }
//     await Notification.findByIdAndDelete(id);
//     response.status(204).json({ message: "done" });
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = notificationRouter;
