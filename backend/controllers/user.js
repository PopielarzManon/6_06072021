const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const maskData = require("maskdata");


 


//Sécurité
const emailMaskOptions = {
  maskWith: "*",
  unmaskedStartCharactersBeforeAt: 1,
  unmaskedEndCharactersAfterAt: 1,
  maskAtTheRate: false,
};

//Création d'un compte
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: maskData.maskEmail2(req.body.email, emailMaskOptions),
        password: hash, schema,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error })); 
    })
    .catch((error) => res.status(500).json({ error }));
};

//Connextion à un compte
exports.login = (req, res, next) => {
  User.findOne({
    email: maskData.maskEmail2(req.body.email, emailMaskOptions), 
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.DB_TOKEN, {
              expiresIn: "12h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
