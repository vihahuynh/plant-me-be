const jwt = require("jsonwebtoken");
const User = require("./../models/user");

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "invalid token",
    });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }

  next(error);
};

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const tokenExtractor = async (request, response, next) => {
  try {
    // if (request.method === "GET" && request.path.startsWith("/api/products")) {
    //     next()
    // }
    const authorization = request.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
      request.token = authorization.substring(7);
    }

    const decodedToken = request.token
      ? jwt.verify(request.token, process.env.SECRET)
      : null;
    if (!decodedToken?.id) {
      return response.status(401).json({ err: "invalid or missing token" });
    }
    const user = await User.findById(decodedToken?.id);
    if (!user) {
      return response.json(403).json({ err: "permission denied" });
    }
    request.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  errorHandler,
  requestLogger,
  unknownEndpoint,
  tokenExtractor,
};
