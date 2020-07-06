const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.getTuturu = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection('tuturu')
    .get()
    .then((data) => {
      let tuturus = [];
      data.forEach((doc) => {
        tuturus.push(doc.data());
      });
      return res.json(tuturus);
    })
    .catch((err) => console.error(err));
});
