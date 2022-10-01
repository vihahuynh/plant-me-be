const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
  try {
    const user = await User.findByCredentials(
      request.body.loginData,
      request.body.password
    );
    const token = await user.generateAuthToken();

    const returnedUser = {
      ...user._doc,
      id: user._doc._id.toString(),
      token,
    };

    console.log(returnedUser);

    delete returnedUser.passwordHash;
    delete returnedUser.__v;
    delete returnedUser._id;

    response.status(200).send(returnedUser);
  } catch (err) {
    response.status(400).json({ err: "Invalid email/username or password" });
  }
});

module.exports = loginRouter;
