const passSchema = require("../models/password");

module.exports = (req, res, next) => {
    if (!passSchema.validate(req.body.password)) {
        return res.status(400).json({
            error: "Mot de passe faible. Au moins une minuscule et majuscule, entre 8 dont au moins 2 chiffres" +
                passSchema.validate("Essaie encore", { list: true }),
        });
    } else {
        next();
    }
};