const { admin, db } = require(`./admin`);

module.exports = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    var idToken = req.headers.authorization.split(`Bearer `)[1];
  } else {
    console.error("No token found");
    return res.status(403).json({ error: `Unauthorized` });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      return db.collection("users").where("userId", "==", req.user.uid).limit(1).get();
    })
    .then((data) => {
      req.user.userHandle = data.docs[0].data().userHandle;
      req.user.profileImageUrl = data.docs[0].data().profileImageUrl;
      return next();
    })
    .catch((err) => {
      console.error("Error while verifying token ", err);
      return res.status(400).json(err);
    });
};
