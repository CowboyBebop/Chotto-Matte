const functions = require("firebase-functions");
const { ResultStorage } = require("firebase-functions/lib/providers/testLab");

const app = require("express")();

const FBAuth = require("./util/fbAuth");
const { db } = require(`./util/admin`);

const {
  getAllTuturus,
  postOneTuturu,
  getTuturuById,
  postCommentOnTuturu,
  likeTuturuPost,
  unlikeTuturuPost,
  deleteTuturuById,
} = require(`./handlers/tuturus`);

const {
  signup,
  login,
  uploadProfileImage,
  addUserDetails,
  getAuthenticatedUserData,
} = require(`./handlers/users`);
const fbAuth = require("./util/fbAuth");

// Tuturu routes
app.get("/tuturus", FBAuth, getAllTuturus);
app.get("/tuturu/:tuturuId", getTuturuById);
app.post("/tuturu", FBAuth, postOneTuturu);
app.post("/tuturu/:tuturuId/comment", FBAuth, postCommentOnTuturu);
app.post("/tuturu/:tuturuId/like", FBAuth, likeTuturuPost);
app.post("/tuturu/:tuturuId/unlike", FBAuth, unlikeTuturuPost);
app.delete("/tuturu/:tuturuId", FBAuth, deleteTuturuById);

//user routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadProfileImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUserData);

exports.api = functions.region("europe-west3").https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("europe-west3")
  .firestore.document("/likes/{id}")
  .onCreate(async (snapshot) => {
    try {
      let docData = await db.doc(`/tuturus/${snapshot.data().tuturuId}`).get();

      if (docData.exists) {
        await db.doc(`/notifications/${snapshot.id}`).set({
          recipient: docData.data().userHandle,
          sender: snapshot.data().userHandle,
          read: "false",
          type: "like",
          tuturuId: docData.id,
          createdAt: new Date().toISOString(),
        });
      }
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  });

exports.deleteNotificationOnLide = functions
  .region("europe-west3")
  .firestore.document("/likes/{id}")
  .onDelete(async (snapshot) => {
    try {
      await db.doc(`/notifications/${snapshot.id}`).delete();
    } catch (err) {
      console.error(err);
      return;
    }
  });

exports.createNotificationOnComment = functions
  .region("europe-west3")
  .firestore.document("/comments/{id}")
  .onCreate(async (snapshot) => {
    try {
      let docData = await db.doc(`/tuturus/${snapshot.data().tuturuId}`).get();

      if (docData.exists) {
        await db.doc(`/notifications/${snapshot.id}`).set({
          recipient: docData.data().userHandle,
          sender: snapshot.data().userHandle,
          read: "false",
          type: "comment",
          tuturuId: docData.id,
          createdAt: new Date().toISOString(),
        });
      }
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  });
