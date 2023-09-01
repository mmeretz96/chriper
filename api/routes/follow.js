const express = require("express");
let router = express.Router();
const db = require("../db").getDb();

router.post("/", (req, res, next) => {
  const userId = req.user.id;
  const followId = req.body.followId;
  const sql = `INSERT INTO follows (followerId, followedId) VALUES (?, ?)`;
  const data = [userId, followId];
  db.query(sql, data, (error, result) => {
    if (error) {
      next(error);
    }
    res.send(result);
  });
});

router.delete("/:id", (req, res, next) => {
  const userId = req.user.id;
  const followId = req.params.id;
  const sql = `DELETE FROM follows WHERE followerId = ? AND followedId = ?`;
  const data = [userId, followId];
  db.query(sql, data, (error, result) => {
    if (error) {
      next(error);
    }
    res.send(result);
  });
});

module.exports = router;
