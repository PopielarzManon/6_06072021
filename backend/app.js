require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const uniqueValidator = require('mongoose-unique-validator');
const helmet = require("helmet");
const cookieSession = require("cookie-session"); // import cookie-session handler
const xssClean = require("xss-clean"); // import xxs attack counter
const mongoSanitize = require("express-mongo-sanitize");


const userRoutes = require('./routes/user');
const path = require('path');
const stuffRoutes = require('./routes/sauces');



//mongoose securisé

mongoose
  .connect(process.env.DB_MONGOOSE, {
   useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// init express
const app = express();

//SECURITE
app.use(helmet());

app.use(
  cookieSession({
      name: "session",
      secret: process.env.DB_COOKIE, // basic password exapmle
      cookie: {
          secure: true,
          httpOnly: true,
          domain: "http://localhost:3000/",
      },
  })
);

app.disable("x-powered-by");

app.use(mongoSanitize());

app.use(xssClean());
 //


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;




 