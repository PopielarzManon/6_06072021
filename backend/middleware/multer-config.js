const multer = require("multer");

const MIME_TYPES = {
  //Types d'images acceptés
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};
//Utilise la méthode multer pour sauvegarder le fichier
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    //transforme les espaces en _ pour éviter les erreurs
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});
//exporte le fichier pour qu'il soit unique
module.exports = multer({ storage: storage }).single("image");
