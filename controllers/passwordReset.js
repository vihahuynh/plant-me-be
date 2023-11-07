const passwordResetRouter = require("express").Router();
const User = require("./../models/user");
const Token = require("./../models/token");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendPasswordResetEmail = require("../utils/sendPasswordResetEmail");

passwordResetRouter.post("/", async (request, response, next) => {
  try {
    const user = await User.findOne({ email: request.body.email });
    if (!user) {
      return response.status(404).json({ err: "No user found" });
    }
    const newToken = new Token({
      user: user.id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    const returnedToken = await newToken.save();

    const link = `${process.env.URL}/password-reset/${user._id}/${returnedToken.token}`;
    await sendPasswordResetEmail(
      user.email,
      "[Plantme] Please reset your password",
      link
    );
    response.json({ message: "Password reset link had sent to user." });
  } catch (err) {
    next(err);
  }
});

passwordResetRouter.post("/:userId/:token", async (request, response, next) => {
  try {
    const user = await User.findById(request.params.userId);
    if (!user) {
      return response
        .status(400)
        .json({ err: "Invalid link or expired - user" });
    }
    const token = await Token.findOne({
      user: request.params.userId,
      token: request.params.token,
    });
    if (!token) {
      return response
        .status(400)
        .json({ err: "Invalid link or expired - token" });
    }

    // const now = Date.now()
    // const tokenCreatedAt = token.createdAt.getTime()
    // 01 hour
    // if (now - tokenCreatedAt < 3600000) {
    //     return response.status(400).json({ err: "Invalid link or expired - token" })
    // }
    const saltRounds = 10;
    user.passwordHash = await bcrypt.hash(request.body.password, saltRounds);
    await user.save();
    await token.remove();
    response.json({ message: "Password reset successfully." });
  } catch (err) {
    next(err);
  }
});

module.exports = passwordResetRouter;
