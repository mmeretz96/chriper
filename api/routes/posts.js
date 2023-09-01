const express = require("express");
let router = express.Router();
const db = require("../db").getDb();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded image
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res, next) => {
  db.query(
    `SELECT post.*, post.image as postImage, users.username, users.name, users.surname, users.image as userImage ,COUNT(likes.userId) AS liked
      FROM post 
      LEFT JOIN users
      ON post.userId = users.id
      LEFT JOIN likes ON post.id = likes.itemId AND likes.userId = ? AND likes.itemType = 'post'
      GROUP BY post.id
      ORDER BY createdAt DESC`,
    [req.user ? req.user.id : null],
    (error, result) => {
      if (error) {
        next(error);
        return;
      }
      res.send(result);
      return;
    }
  );
});

router.get("/user/:username", async (req, res, next) => {
  const postsFromUsername = req.params.username;
  db.query(
    `SELECT post.*, post.image as postImage, users.username, users.name, users.surname, users.image as userImage ,COUNT(likes.userId) AS liked
      FROM post 
      LEFT JOIN users
      ON post.userId = users.id
      LEFT JOIN likes ON post.id = likes.itemId AND likes.userId = ? AND likes.itemType = 'post'
      WHERE users.username = ?
      GROUP BY post.id
      ORDER BY createdAt DESC`,
    [req.user ? req.user.id : null, postsFromUsername],
    (error, result) => {
      if (error) {
        next(error);
        return;
      }
      res.send(result);
    }
  );
});

router.get("/following", async (req, res, next) => {
  if (!req.user) {
    res.status(401).send("Unauthorized");
    return;
  }
  db.query(
    `SELECT post.*, post.image as postImage, users.username, users.name, users.surname, users.image as userImage ,COUNT(likes.userId) AS liked, followerID
    FROM post 
    LEFT JOIN users
    ON post.userId = users.id
    LEFT JOIN likes 
    ON post.id = likes.itemId AND likes.userId = ? AND likes.itemType = 'post'
    LEFT Join follows
    ON follows.followerId = ? AND post.userId = follows.followedId
    WHERE follows.followerId = ?
    GROUP BY post.id
    ORDER BY createdAt DESC`,
    [req.user.id, req.user.id, req.user.id],
    (error, result) => {
      if (error) {
        next(error);
        return;
      }
      res.send(result);
    }
  );
});

router.post("/", upload.single("image"), async (req, res, next) => {
  if (!req.user) {
    res.status(401).send("Unauthorized");
    return;
  }
  const imgPath = req.file ? "/static/images/" + req.file.filename : null;
  const sql = `INSERT INTO post (textcontent, userId, image) VALUES (?, ?, ?)`;
  const body = req.body;
  const data = [body.textcontent, req.user.id, imgPath];
  db.query(sql, data, (error, result) => {
    if (error) {
      next(error);
    }
    res.send(result);
  });
});

router.delete("/:id", async (req, res, next) => {
  if (!req.user) {
    res.status(401).send("Unauthorized");
    return;
  }
  const sql = `DELETE FROM post WHERE id = ? AND userId = ?`;
  const data = [req.params.id, req.user.id];
  db.query(sql, data, (error, result) => {
    if (error) {
      next(error);
    }
    res.send(result);
  });
});

router.post("/:postId/like", async (req, res, next) => {
  if (!req.user) {
    res.status(401).send("Unauthorized");
    return;
  }
  const sql = `INSERT INTO likes (userId, itemId, itemType) VALUES (?, ?, ?)`;
  const data = [req.user.id, req.params.postId, "post"];
  db.query(sql, data, (error, result) => {
    if (error) {
      next(error);
    }
    res.send(result);
  });
});

router.delete("/:postId/like", async (req, res, next) => {
  if (!req.user) {
    res.status(401).send("Unauthorized");
    return;
  }
  const sql = `DELETE FROM likes WHERE userId = ? AND itemId = ? AND itemType = ?`;
  const data = [req.user.id, req.params.postId, "post"];
  db.query(sql, data, (error, result) => {
    if (error) {
      next(error);
    }
    res.send(result);
  });
});

module.exports = router;
