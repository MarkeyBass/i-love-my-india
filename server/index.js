const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const postsRoute = require("./routes/posts");
const categoriesRoute = require("./routes/categories");
// Uploading files package
const multer = require("multer");

const path = require("path");

dotenv.config();
app.use(express.json()); //Body Parser

// Creating static folders that we can use globaly in the APP
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
  .connect(process.env.DB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: true,
  })
  .then(console.log("Conected to MongoDB Atlas"))
  .catch((err) => console.log(err));

// Multer
const storage = multer.diskStorage({
  // Where to save on disk
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // The name of the file will come from the react application
  filename: (req, file, callback) => {
    callback(null, req.body.name);
    // callback(null, "firstPic.jpg");
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    res.status(200).json("File has been uploaded");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/posts", postsRoute);
app.use("/api/categories", categoriesRoute);

const PORT = "5000";
app.listen(PORT, () =>
  console.log("server is listenning on port " + PORT + "...")
);
