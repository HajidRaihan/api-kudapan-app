const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const getRoleFromToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.role;
};

const verifyUser = (requiredRole) => {
  return (req, res, next) => {
    if (!req.headers["authorization"]) {
      return next(createError.Unauthorized());
    }

    const token = req.headers["authorization"];
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));
      }

      const userRole = getRoleFromToken(token);

      if (payload.role !== userRole || (requiredRole && requiredRole !== userRole)) {
        return next(createError.Unauthorized());
      }

      req.payload = payload;
      next();
    });
  };
};

module.exports = {
  verifyUser,
  getRoleFromToken,
};
