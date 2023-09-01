const express = require("express");
let router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
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

//CREATE USER
router.post(
  "/register",
  upload.single("image"),
  async function (req, res, next) {
    let imgPath = req.file
      ? "/static/images/" + req.file.filename
      : "/static/images/avatar.png";
    const sql = `INSERT INTO users 
    (username, name, surname, email, password, image) 
    VALUES (?, ?, ?, ?, ?,?)`;
    const body = req.body;
    const hashedPw = await bcrypt.hash(body.password, saltRounds);
    const data = [
      body.username,
      body.name,
      body.surname,
      body.email,
      hashedPw,
      imgPath,
    ];
    db.query(sql, data, (error, result) => {
      if (error) {
        next(error);
      }
      res.send(result);
    });
  }
);

const authenticateUser = (username, password) => {
  return getUserByUsername(username).then((result) => {
    if (result.length === 0) {
      throw new Error("User not found");
    }
    const { password: hashedPassword, ...user } = result[0];
    if (!bcrypt.compareSync(password, hashedPassword)) {
      throw new Error("Wrong password");
    }
    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "7days",
    });
    return { token, user };
  });
};

const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.query(sql, [username], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

router.post("/login", async function (req, res, next) {
  try {
    const { username, password } = req.body;
    const { token, user } = await authenticateUser(username, password);

    res.cookie("token", token, { httpOnly: true });
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.get("/checkLogin", function (req, res) {
  if (!req.user) {
    res.send({ loggedIn: false });
    return;
  }
  db.query(
    `SELECT username, name, surname, email, image, followers FROM users WHERE username = ?`,
    [req.user.username],
    (error, result) => {
      if (error) {
        next(error);
      }
      res.send({ loggedIn: true, user: result[0] });
    }
  );
  /*const token = req.cookies.token;
  console.log(token);
  if (!token) {
    res.send({ loggedIn: false });
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.send({ loggedIn: false });
      return;
    }
    console.log(decoded);
    res.send({ loggedIn: true, user: decoded });
  });*/
});

router.get("/logout", (req, res) => {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true }).send();
});

router.get("/checkUsername/:username", function (req, res) {
  let sql = `SELECT * FROM users WHERE username = ?`;
  db.query(sql, [req.params.username], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send({ available: result.length === 0 });
  });
});

module.exports = router;
