const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { ResultStorage } = require("firebase-functions/lib/providers/testLab");

admin.initializeApp();

const express = require("express");
const app = express();

var firebaseConfig = {
  apiKey: "AIzaSyDmahf902seIOzpocbagOixdSFYJmSLF94",
  authDomain: "chotto-matte.firebaseapp.com",
  databaseURL: "https://chotto-matte.firebaseio.com",
  projectId: "chotto-matte",
  storageBucket: "chotto-matte.appspot.com",
  messagingSenderId: "381171707829",
  appId: "1:381171707829:web:3d5c5ad15314f4fc1ef3fc",
};

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

const fBAuth = (req,res,next) => {
  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    idToken = req.headers.authorization.split(`Bearer `)[1];
  } else {
    console.error('No token found');
    return res.status(403).json({error: `Unauthorized`})
  }

  admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;
      return db.collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get()
    })
    .then(data => {
      req.user.userHandle = data.docs[0].data().userHandle;
      return next();
    })
    .catch(err => {
      console.error('Error while verifying token ', err);
      return res.status(400).json(err);

    });
}

app.get("/alltuturu",fBAuth, (req, res) => {
  db.collection("tuturu")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let tuturus = [];
      data.forEach((doc) => {
        tuturus.push({
          tuturuId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(tuturus);
    })
    .catch((err) => console.error(err));
});

app.post("/createTuturu",fBAuth, (req, res) => {
  const newTuturu = {
    body: req.body.body,
    userHandle: req.user.userHandle,
    createdAt: new Date().toISOString(),
  };

  db.collection("tuturu")
    .add(newTuturu)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});

const isEmpty = (string) => {
  if (string.trim() === ``) return true;
  else return false;
};

const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

//signup route
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userHandle: req.body.userHandle,
  };

  let errors = {};

  if (isEmpty(newUser.email)) errors.email = `Must not be empty`;
  else if (!isEmail(newUser.email))
    errors.email = `Must be a valid email address`;

  if (isEmpty(newUser.password)) errors.password = `Must not be empty`;
  if (isEmpty(newUser.userHandle)) errors.userHandle = `Must not be empty`;
  if (newUser.password !== newUser.confirmPassword)
    errors.password = `Passwords must match`;

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

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
});

app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  let errors = {};

  if (isEmpty(user.email)) errors.email = `Must not be empty`;
  if (isEmpty(user.password)) errors.password = `Must not be empty`;

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

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
});

exports.api = functions.region("europe-west3").https.onRequest(app);
