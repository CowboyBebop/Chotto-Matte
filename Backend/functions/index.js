const functions = require("firebase-functions");
const { ResultStorage } = require("firebase-functions/lib/providers/testLab");

const app = require("express")();

const FBAuth = require("./util/fbAuth");
const { db } = require(`./util/admin`);

const cors = require("cors");
app.use(cors());

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
  markNotificationsAsRead,
  getUserDetails,
} = require(`./handlers/users`);
const fbAuth = require("./util/fbAuth");

// Tuturu routes
app.get("/tuturus", getAllTuturus);
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
app.post("/notifications", FBAuth, markNotificationsAsRead);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUserData);
app.get("/user/:userHandle", getUserDetails);

exports.api = functions.region("europe-west3").https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("europe-west3")
  .firestore.document("/likes/{id}")
  .onCreate(async (snapshot) => {
    try {
      let docData = await db.doc(`/tuturus/${snapshot.data().tuturuId}`).get();

      if (docData.exists && doc.data().userHandle !== snapshot.data().userHandle) {
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

exports.deleteNotificationOnUnlike = functions
  .region("europe-west3")
  .firestore.document("/likes/{id}")
  .onDelete(async (snapshot) => {
    try {
      await db.doc(`/notifications/${snapshot.id}`).delete();
      return;
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

      if (docData.exists && doc.data().userHandle !== snapshot.data().userHandle) {
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

exports.onUserImageChange = functions
  .region("europe-west3")
  .firestore.document("/users/{userId}")
  .onUpdate(async (change) => {
    try {
      if (change.before.data().profileImageUrl !== change.after.data().profileImageUrl) {
        let batch = db.batch();
        let userPostsDoc = await db
          .collection("tuturus")
          .where("userHandle", "==", change.before.data().userHandle)
          .get();

        userPostsDoc.forEach((doc) => {
          const tuturu = db.doc(`/tuturus/${doc.id}`);
          batch.update(tuturu, { profileImageUrl: change.after.data().profileImageUrl });
        });
        return batch.commit();
      }
    } catch (err) {
      console.error(err);
      return;
    }
  });

exports.onTuturuDelete = functions
  .region("europe-west3")
  .firestore.document("/tuturus/{tuturuId}")
  .onDelete(async (snapshot, context) => {
    try {
      const tuturuId = context.params.tuturuId;
      const batch = db.batch();

      let commentDocData = await db.collection("comments").where("tuturuId", "==", tuturuId).get();

      commentDocData.forEach((doc) => {
        batch.delete(db.doc(`/comments/${doc.id}`));
      });

      let likeDocData = await db.collection("likes").where("tuturuId", "==", tuturuId).get();

      likeDocData.forEach((doc) => {
        batch.delete(db.doc(`/likes/${doc.id}`));
      });

      let notificationDocData = await db
        .collection("notifications")
        .where("tuturuId", "==", tuturuId)
        .get();

      notificationDocData.forEach((doc) => {
        batch.delete(db.doc(`/notifications/${doc.id}`));
      });
      return batch.commit();
    } catch (err) {
      console.error(err);
      return;
    }
  });
