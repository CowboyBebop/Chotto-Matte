const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { ResultStorage } = require("firebase-functions/lib/providers/testLab");

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

exports.createTuturu = functions.https.onRequest((req, res) => {
  const newTuturu = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  };

  admin.firestore()
    .collection('tuturu')
    .add(newTuturu)
    .then(doc => {
      res.json({message: `document ${doc.id} created successfully`})
    })
    .catch(err => {
      res.status(500).json({error: 'something went wrong'})
      console.error(err);
    })
});
