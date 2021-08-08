//Applications utilisées :
// npm install -g @angular/cli
// depuis dossier frontend créé et cloner (après git) -> npm install -> ng serve (fait tourner l'app en direct)
// npm install -g nodemon
// npm install --save express
// npm install --save body-parser
// npm install --save mongoose
// npm install --save mongoose-unique-validator
// npm install --save bcrypt
// npm install --save jsonwebtoken
// npm install --save multer
// npm install --save dotenv
// npm install --save helmet
// npm install --save cookie-session
// npm install --save xss-clean
// npm install express-mongo-sanitize
// npm install i maskdata (controllers/user.js)


require('dotenv').config() //Loade les variables
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');//framework Mongoose

//Import de sécurité
const uniqueValidator = require('mongoose-unique-validator'); 
const helmet = require("helmet"); 
const cookieSession = require("cookie-session"); 
const xssClean = require("xss-clean"); 
const mongoSanitize = require("express-mongo-sanitize");

//Import des routes
const userRoutes = require('./routes/user');
const path = require('path');
const stuffRoutes = require('./routes/sauces');


//Connextion à Mongoose avec les id et mdp
mongoose
  .connect(process.env.DB_MONGOOSE, {
   useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// init express
const app = express();

//Sécurité de Helmet
app.use(helmet());
//Sécurise la session avec httponly et change le nom de la session
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
//Empèche une éventuelle entrée par le header
app.disable("x-powered-by");

app.use(mongoSanitize());

app.use(xssClean());


//Modifier l'accès et erreur CORS
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




 