const jwt = require("jsonwebtoken");

exports.authCheck = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
   return res.status(403).json({ message: "Invalid token", statusCode: 403 });
  }
  const token = req.headers.authorization?.replace("Bearer ", "");
  try {
    const user = jwt.verify(token, process.env.TOKEN_SECRET);

    if (!user) throw new Error("Invalid token");

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: error.message, statusCode: 403 });
  }
};
