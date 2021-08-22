require("dotenv").config(); //Load les variables
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Import de sécurité

const helmet = require("helmet");
const cookieSession = require("cookie-session");
const xssClean = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");


//Import des routes
const userRoutes = require("./routes/user");
const path = require("path");
const stuffRoutes = require("./routes/sauces");
const rateLimit = require("express-rate-limit");

//Connextion à Mongoose avec les id et mdp
mongoose
  .connect(process.env.DB_MONGOOSE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// init express
const app = express();

//Sécurité de Helmet
app.use(helmet());
//Sécurise la session avec httponly et change le nom de la session
app.use(
  cookieSession({
    name: "session",
    secret: process.env.DB_COOKIE,
    cookie: {
      secure: true,
      httpOnly: true,
      domain: "http://localhost:3000/",
    },
  })
);
//Empèche une éventuelle entrée par le header
app.disable("x-powered-by");

app.use(mongoSanitize());

app.use(xssClean());
app.use(limiter);
//limite rate
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});

//Modifier l'accès et erreur CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", stuffRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
