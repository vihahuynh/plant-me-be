const fs = require("fs").promises;
const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("./../models/user");

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
        error: "Email address is already!",
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

    response.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
});

usersRouter.patch("/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    const decodedToken = request.token
      ? jwt.verify(request.token, process.env.SECRET)
      : null;
    if (!decodedToken?.id) {
      return response.status(401).json({ err: "token missing or invalid" });
    }
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response.status(404).json({ message: "No user found" });
    }

    const userToUpdate = request.body;
    const url = `${request.protocol}://${request.get(
      "host"
    )}/photos/${id}-avatar.png`;

    delete userToUpdate.avatarUrl;

    if (userToUpdate?.avatarUrl) {
      const base64Data = userToUpdate?.avatarUrl?.replace(
        /^data:image\/png;base64,/,
        ""
      );
      await fs.writeFile(`./photos/${id}-avatar.png`, base64Data, "base64");

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
});

usersRouter.get("/", async (request, response, next) => {
  try {
    const decodedToken = request.token
      ? jwt.verify(request.token, process.env.SECRET)
      : null;
    if (!decodedToken?.id) {
      return response.status(401).json({ err: "token missing or invalid" });
    }
    const user = await User.findById(decodedToken.id);
    if (user && user.isAdmin) {
      const users = await User.find();
      return response.json(users);
    }
    return response.status(403).json({ err: "permission denied" });
  } catch (err) {
    next(err);
  }
});

module.exports = usersRouter;
