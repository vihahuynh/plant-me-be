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

usersRouter.put("/:id", async (request, response, next) => {
  try {
    const { body } = request;
    const decodedToken = request.token
      ? jwt.verify(request.token, process.env.SECRET)
      : null;
    if (!decodedToken?.id) {
      response.status(401).json({ err: "token missing or invalid" });
    }
    const user = await User.findById(decodedToken.id);
    if (user.username === body.username || user.isAdmin) {
      const userToUpdate = {
        likedReviews: body.likedReviews,
        likedProducts: body.likedProducts,
      };
      // TODO: update avatarImage
      const updatedUser = await User.findByIdAndUpdate(
        request.params.id,
        userToUpdate,
        { new: true, runValidators: true }
      ).populate("likedProducts");
      return response.json(updatedUser);
    }
    if (!user) {
      response.status(404).json({ message: "No user found" })
    }
    response.status(403).json({ err: "permission denied" });
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
