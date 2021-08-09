const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //Vérifie le token
    const decodedToken = jwt.verify(token, process.env.DB_TOKEN);
    //Garde le userId dans le token
    const userId = decodedToken.userId;
    //Erreur en fonction du token
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
