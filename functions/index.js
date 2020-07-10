const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { ResultStorage } = require("firebase-functions/lib/providers/testLab");

admin.initializeApp();

const express = require('express');
const app = express();



app.get('/alltuturu',(req, res) => {
  admin
    .firestore()
    .collection('tuturu')
    .orderBy('createdAt','desc')
    .get()
    .then((data) => {
      let tuturus = [];
      data.forEach((doc) => {
        tuturus.push({
          tuturuId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(tuturus);
    })
    .catch((err) => console.error(err));
});

app.post('/createTuturu', (req, res) => {

  const newTuturu = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
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

exports.api = functions.region('europe-west3').https.onRequest(app);
