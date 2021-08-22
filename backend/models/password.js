const passValidator = require("password-validator");

const passSchema = new passValidator();
passSchema
    .is().min(8)
    .has().uppercase()
    .has().lowercase()
    .has().digits(2)
    .has().not().spaces()
    .is().not().oneOf(["Passw0rd", "Password123"]);


module.exports = passSchema;