const {admin, db } = require(`../util/admin`);

const config = require("../util/config");

const firebase = require("firebase");
firebase.initializeApp(config);

const { validateSignupData, validateLoginData } = require(`../util/validators`);

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userHandle: req.body.userHandle,
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  const defaultpfp = 'default-pfp-img.png';

  //TODO: validate data
  let token, userId;
  db.doc(`/users/${newUser.userHandle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ userHandle: "you came into the wrong neigborhood fool!" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        userHandle: newUser.userHandle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        profileImage: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/0/${defaultpfp}?alt=media`,
        userId,
      };
      return db.doc(`/users/${newUser.userHandle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res
          .status(400)
          .json({ handle: "you came into the wrong neigborhood fool!" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === `auth/wrong-password`) {
        return res
          .status(403)
          .json({ general: `Wrong credentials, please try again` });
      } else return res.status(500).json({ error: err.code });
    });
};

exports.uploadProfileImage = (req, res) => {
  const BusBoi = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboi = new BusBoi({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname + " : " + filename + " : " + mimetype);

    //my.image.png
    const splitFilename = filename.split(".");
    const imageExtension = splitFilename[splitFilename.length - 1];
    //12321505124050.png
    imageFileName = `${Math.round(
      Math.random() * 100000000000
    )}.${imageExtension}`;

    const filepath = path.join(os.tmpdir(), imageFileName);

    imageToBeUploaded = {filepath, mimetype};
    file.pipe(fs.createWriteStream(filepath));
  });
  busboi.on('finish',() => {
    admin.storage().bucket().upload(imageToBeUploaded.filename, {
      resumable: false,
      metadata : {
        metadata : {
          contentType: imageToBeUploaded.mimetype
        }
      }
    })
    .then( () => {
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/0/${imageFileName}?alt=media`
      return db.doc(`/users/${req.user.userHandle}`).update({imageUrl});
    })
    .then( () => {
      return res.json({message: `image uploaded successfuly`})
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({error:err.code});
    })
  })
};
