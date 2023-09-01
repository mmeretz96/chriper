const express = require("express");
const cors = require("cors");
const app = express();
require("./db").initDb();
const getDb = require("./db").getDb;
require("dotenv").config();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

//Connect to Database
const db = getDb();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

//AUTH MIDDLEWARE
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.user = null;
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.clearCookie("token");
      } else {
        req.user = decoded;
      }
    });
  }
  next();
});

const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/users");
const followRouter = require("./routes/follow");
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static("public"));

//ROUTERS
app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/profile", userRouter);
app.use("/follow", followRouter);

//ERROR HANDLER
app.use((err, req, res, next) => {
  console.log("ERROR: ", err.message);
  if (err.code === "ER_DUP_ENTRY") {
    let errorMessage;
    if (err.sqlMessage.includes("username")) {
      errorMessage =
        "Username already exists. Please choose a different username.";
    } else if (err.sqlMessage.includes("email")) {
      errorMessage = "Email address is already registered.";
    } else {
      errorMessage = "Duplicate entry encountered for one or more fields.";
    }
    res.status(409).json({
      error: "DuplicateEntry",
      message: errorMessage,
    });
  } else {
    res.status(500).json(err.message);
  }
});

//Start the server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
