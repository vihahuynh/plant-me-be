const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
  const { loginData, password } = request.body;

  let user;
  user = await User.findOne({ username: loginData });

  if (!user) {
    user = await User.findOne({ email: loginData });
  }
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "Invalid Username/Email or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  // token expires in 24*60*60 seconds, that is, in 7 days
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 7 * 24 * 60 * 60,
  });

  const returnedUser = {
    ...user._doc,
    id: user._doc._id.toString(),
    token
  }

  delete returnedUser.passwordHash
  delete returnedUser.__v
  delete returnedUser._id

  response
    .status(200)
    .send(returnedUser);
});

module.exports = loginRouter;
