const { db } = require(`../util/admin`);

exports.getAllTuturus = (req, res) => {
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
};

exports.postOneTuturu = (req, res) => {
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
};
