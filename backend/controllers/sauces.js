const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes:0,
    dislikes:0,
    usersLiked:[],
    usersDisliked:[],
    

  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};


exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllStuff = (req, res, next) => {
  Sauce.find().then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
exports.likeSauce = (req, res, next) => {
  console.log({ _id: req.params.id });
  console.log({ likes: req.body.like });
  console.log({ usersLiked: req.body.userId });

  // Every users can like a Sauce but a user can like or dislike one at a time
  // So here is how it checks if it's liked or not, adapt numbers and count every likes and dislikes
  const sauceObject = req.body;
  console.log(sauceObject);
  // If the sauce is not either liked nor disliked
  // Checking if the user likes the sauce
  if (sauceObject.like === 1) {
      Sauce.updateOne({ _id: req.params.id }, {
              // add one more like
              $inc: { likes: +1 },
              // add the user id to the Likes list of this sauce
              $push: { usersLiked: req.body.userId },
          })
          .then(() => res.status(200).json({ message: "un like en plus ! On aime ça !" }))
          .catch((error) => res.status(400).json({ error }));
      // Checking if the user dislikes the sauce
  } else if (sauceObject.like === -1) {
      Sauce.updateOne({ _id: req.params.id }, {
              // If the sauce is not liked, add 1 dislike
              $inc: { dislikes: +1 },
              // add the user id to the Dislikes list of this sauce
              $push: { usersDisliked: req.body.userId },
          })
          .then(() => res.status(200).json({ message: "un dislike en plus ! Ah bon ?" }))
          .catch((error) => res.status(400).json({ error }));
  } else {
      // If the user already liked or disliked the sauce
      // look for this specific sauce
      Sauce.findOne({ _id: req.params.id })
          .then((sauce) => {
              console.log(sauce);
              // then check if the user's Id is in the Likes list
              if (sauce.usersLiked.includes(req.body.userId)) {
                  Sauce.updateOne({ _id: req.params.id }, {
                          // get back the userId
                          $pull: { usersLiked: req.body.userId },
                          // decrease number of likes
                          $inc: { likes: -1 },
                      })
                      .then(() => res.status(200).json({ message: "enleve le like ! Mince alors.." }))
                      .catch((error) => res.status(400).json({ error }));
                  // or if the user's Id is in the Dislikes list
              } else if (sauce.usersDisliked.includes(req.body.userId)) {
                  Sauce.updateOne({ _id: req.params.id }, {
                          // get back the userId
                          $pull: { usersDisliked: req.body.userId },
                          // decrease number of dislikes
                          $inc: { dislikes: -1 },
                      })
                      .then(() => res.status(200).json({ message: "enleve le dislike ! Yepa !" }))
                      .catch((error) => res.status(400).json({ error }));
              }
          })
          .catch((error) => res.status(400).json({ error }));
  }
};