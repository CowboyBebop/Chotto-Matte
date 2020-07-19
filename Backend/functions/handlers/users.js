const { admin, db } = require(`../util/admin`);

const config = require("../util/config");

const firebase = require("firebase");
firebase.initializeApp(config);

const { validateSignupData, validateLoginData, reduceUserDetails } = require(`../util/validators`);
const { UserRecordMetadata, user } = require("firebase-functions/lib/providers/auth");

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userHandle: req.body.userHandle,
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  const defaultpfp = "default-pfp-img.png";

  let token, userId;
  db.doc(`/users/${newUser.userHandle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ userHandle: "you came into the wrong neigborhood fool!" });
      } else {
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
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
        profileImageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultpfp}?alt=media`,
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
        return res.status(400).json({ email: "Email already in use" });
      } else {
        return res.status(500).json({ general: "Something went wrong, please try again" });
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
        return res.status(403).json({ general: `Wrong credentials, please try again` });
      } else return res.status(500).json({ error: err.code });
    });
};

exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.userHandle}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "Details added successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.uploadProfileImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/png" && mimetype !== "image/jpeg") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    //my.image.png
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    //12321505124050.png
    imageFileName = `${Math.round(Math.random() * 1000000000000).toString()}.${imageExtension}`;

    const filepath = path.join(os.tmpdir(), imageFileName);

    console.log(typeof filepath);

    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on("finish", () => {
    admin
      .storage()
      .bucket(config.storageBucket)
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.userHandle}`).update({ profileImage: imageUrl });
      })
      .then(() => {
        return res.json({ message: `image uploaded successfuly` });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });

  busboy.end(req.rawBody);
};

//Get authenticated user data
exports.getAuthenticatedUserData = (req, res) => {
  let userData = {};

  db.doc(`/users/${req.user.userHandle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();

        return db.collection("likes").where("userHandle", "==", req.user.userHandle).get();
      }
    })
    .then((data) => {
      userData.likes = [];
      data.forEach((doc) => {
        userData.likes.push(doc.data());
      });
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.userHandle)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then((data) => {
      userData.notifications = [];
      data.forEach((doc) => {
        userData.notifications.push({
          recipient: doc.data().reicipent,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          tuturuId: doc.data().tuturuId,
          type: doc.data().type,
          read: doc.data().read,
          notifiactionId: doc.id,
        });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.getUserDetails = async (req, res) => {
  try {
    let userData = {};

    let userDoc = await db.doc(`users/${req.params.userHandle}`).get();

    if (!userDoc.exists) {
      res.status(404).json({ error: "User not found" });
    }

    userData.user = userDoc.data();

    let userDocData = await db
      .collection("tuturus")
      .where("userHandle", "==", req.params.userHandle)
      .orderBy("createdAt", "desc")
      .get();

    userData.tuturus = [];

    userDocData.forEach((doc) => {
      userData.tuturus.push({ ...doc.data(), tuturuId: doc.id });
    });

    return res.json(userData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

exports.markNotificationsAsRead = async (req, res) => {
  try {
    let batch = db.batch();

    req.body.forEach((notificationId) => {
      const notification = db.doc(`/notifications/${notificationId}`);
      batch.update(notification, { read: true });
    });
    await batch.commit();

    return res.json({ message: "Notifications marked as read" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};
