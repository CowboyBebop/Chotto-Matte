const { db } = require(`../util/admin`);

exports.getAllTuturus = (req, res) => {
  db.collection("tuturus")
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
};

exports.postOneTuturu = (req, res) => {
  const newTuturu = {
    body: req.body.body,
    userHandle: req.user.userHandle,
    profileImageUrl: req.user.profileImageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };

  db.collection("tuturus")
    .add(newTuturu)
    .then((doc) => {
      const resTuturu = newTuturu;
      resTuturu.tuturuId = doc.id;

      res.json(resTuturu);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "something went wrong" });
    });
};

exports.getTuturuById = (req, res) => {
  let tuturuData = {};

  db.doc(`/tuturus/${req.params.tuturuId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Tuturu post not found" });
      }
      tuturuData = doc.data();
      tuturuData.tuturuId = doc.id;

      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("tuturuId", "==", req.params.tuturuId)
        .get();
    })
    .then((data) => {
      tuturuData.comments = [];
      data.forEach((doc) => {
        tuturuData.comments.push(doc.data());
      });
      return res.json(tuturuData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.postCommentOnTuturu = async (req, res) => {
  try {
    if (req.body.body.trim() === "")
      return res.status(400).json({ error: "must not be empty" });

    const newComment = {
      body: req.body.body.trim(),
      createdAt: new Date().toISOString(),
      tuturuId: req.params.tuturuId,
      userHandle: req.user.userHandle,
      profileImageUrl: req.user.profileImageUrl,
    };

    let tuturuDoc = await db.doc(`/tuturus/${req.params.tuturuId}`).get();

    if (!tuturuDoc.exists) {
      return res.status(404).json({ error: "tuturu post not found" });
    }

    await db.collection("comments").add(newComment);

    res.json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json(error.code);
  }
};

exports.likeTuturuPost = async (req, res) => {
  try {
    let tuturuData = {};

    const likeDocument = db
      .collection("likes")
      .where("userHandle", "==", req.user.userHandle)
      .where("tuturuId", "==", req.params.tuturuId)
      .limit(1);

    const tuturuDocument = db.doc(`/tuturus/${req.params.tuturuId}`);

    let tuturuDocData = await tuturuDocument.get();

    if (!tuturuDocData.exists) {
      return res.status(404).json({ error: "Tuturu post not foind" });
    }

    tuturuData = tuturuDocData.data();
    tuturuData.tuturuId = tuturuDocData.id;

    let likeData = await likeDocument.get();

    if (likeData.empty) {
      await db.collection("likes").add({
        tuturuId: req.params.tuturuId,
        userHandle: req.user.userHandle,
      });

      tuturuData.likeCount++;
      await tuturuDocument.update({ likeCount: tuturuData.likeCount });

      res.json(tuturuData);
    } else {
      res.status(400).json({ error: "Tuturu post already liked" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(error.code);
  }
};

exports.unlikeTuturuPost = async (req, res) => {
  try {
    let tuturuData = {};

    const likeDocument = db
      .collection("likes")
      .where("userHandle", "==", req.user.userHandle)
      .where("tuturuId", "==", req.params.tuturuId)
      .limit(1);

    const tuturuDocument = db.doc(`/tuturus/${req.params.tuturuId}`);

    let tuturuDocData = await tuturuDocument.get();

    if (!tuturuDocData.exists) {
      return res.status(404).json({ error: "Tuturu post not foind" });
    }

    tuturuData = tuturuDocData.data();
    tuturuData.tuturuId = tuturuDocData.id;

    let likeData = await likeDocument.get();

    if (likeData.empty) {
      return res
        .status(400)
        .json({ error: "There's no like for this Tuturu post" });
    } else {
      await db.doc(`/likes/${likeData.docs[0].data().id}`).delete();

      tuturuData.likeCount--;
      await tuturuDocument.update({ likeCount: tuturuData.likeCount });

      res.json(tuturuData);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(error.code);
  }
};
