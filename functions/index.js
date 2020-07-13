const functions = require("firebase-functions");
const { ResultStorage } = require("firebase-functions/lib/providers/testLab");

const app = require("express")();

const FBAuth = require('./util/fbAuth');

const { getAllTuturus, postOneTuturu } = require(`./handlers/tuturus`);
const { signup, login, uploadProfileImage } = require(`./handlers/users`);
const fbAuth = require("./util/fbAuth");
  
 // Tuturu routes 
app.get("/tuturus",FBAuth, getAllTuturus);
app.post("/tuturu",FBAuth, postOneTuturu);

//user routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image",fbAuth, uploadProfileImage);

exports.api = functions.region("europe-west3").https.onRequest(app);
