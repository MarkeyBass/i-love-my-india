const router = require("express").Router();
const User = require("../models/User");

const bcrypt = require("bcrypt");
const saltRounds = 10;

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);

    const hash = await bcrypt.hash(req.body.password, salt);
    // const newUser = new User(req.body);
    const newUser = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: hash,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    if (err.code === 11000) {
      res.status(500).json({
        msg: `Username "${req.body.userName}" is already taken. Please Choose different usermame`,
        mongooseErrorCode: 11000,
      });
    } else {
      res.status(500).json(err);
    }
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      userName: req.body.userName,
    });
    // password: req.body.password,
    if (!user) {
      res.status(400).json("Wrong username or password. Please try agin...");
      return;
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      res.status(400).json("Wrong username or password. Please try agin...");
      return;
    }

    const { password, ...others } = user._doc;
    res.status(200).json(others);
    // res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
