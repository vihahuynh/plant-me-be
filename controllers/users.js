const fs = require("fs");
const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("./../models/user");
const Cart = require("./../models/cart");
const middleware = require("./../utils/middleware");

usersRouter.post("/", async (request, response, next) => {
  try {
    const { username, email, password } = request.body;

    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (password.length < 8) {
      return response.status(400).json({
        error: "password must contain at least 8 characters",
      });
    }

    if (existingUser) {
      return response.status(400).json({
        error: "Username is already exists!",
      });
    }

    if (existingEmail) {
      return response.status(400).json({
        error: "Email address is already exists!",
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      email,
      passwordHash,
    });

    const savedUser = await user.save();

    const cart = new Cart({
      items: [],
      quantity: 0,
      user: savedUser._id,
    });

    const savedCart = await cart.save();

    response.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
});

usersRouter.patch(
  "/me/subscribe",
  middleware.tokenExtractor,
  async (request, response, next) => {
    try {
      request.user.subscribed = request.body.subscribed;
      const updatedUser = await request.user.save();
      response.json(updatedUser);
    } catch (err) {
      next(err);
    }
  }
);

usersRouter.patch(
  "/:id",
  middleware.tokenExtractor,
  async (request, response, next) => {
    try {
      const { id } = request.params;
      const user = request.user;
      if (!user) {
        return response.status(404).json({ message: "No user found" });
      }

      const userToUpdate = request.body;
      const url = `${request.protocol}://${request.get(
        "host"
      )}/photos/${id}-avatar.png`;

      if (userToUpdate?.avatarUrl) {
        const base64Data = userToUpdate?.avatarUrl?.replace(
          /^data:image\/png;base64,/,
          ""
        );
        const buff = Buffer.from(base64Data, "base64");
        fs.writeFileSync(`./photos/${id}-avatar.png`, buff, (err) =>
          console.log("err: ", err)
        );

        userToUpdate.avatarUrl = url;
      }
      if (user.username === userToUpdate.username || user.isAdmin) {
        const updatedUser = await User.findByIdAndUpdate(id, userToUpdate, {
          new: true,
          runValidators: true,
        });
        return response.status(200).json(updatedUser);
      } else {
        response.status(403).json({ err: "permission denied" });
      }
    } catch (err) {
      next(err);
    }
  }
);

usersRouter.get(
  "/",
  middleware.tokenExtractor,
  async (request, response, next) => {
    try {
      const user = request.user;
      if (user && user.isAdmin) {
        const users = await User.find();
        return response.json(users);
      }
      return response.status(403).json({ err: "permission denied" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = usersRouter;
