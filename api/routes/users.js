const express = require("express");
let router = express.Router();
const db = require("../db").getDb();

router.get("/", (req, res, next) => {
  const username = req.query.username;
  if (!req.user) {
    db.query(
      `SELECT id, username, name, surname, image, email, followers
      FROM users
      WHERE users.username = ?`,
      [username],
      (error, result) => {
        if (error) {
          next(error);
        }
        res.send(result);
      }
    );
    return;
  }
  const userId = req.user.id;
  db.query(
    `SELECT id, username, name, surname, image, email, followers, COUNT(followedId) as isFollowing
    FROM users
    LEFT JOIN follows
    ON users.id = followedId AND followerId = ?
    WHERE users.username = ?`,
    [userId, username],
    (error, result) => {
      if (error) {
        next(error);
      }
      res.send(result);
    }
  );
});

module.exports = router;
