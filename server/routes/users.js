const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const worningMessage =
  "Illegal operation!! Please leave the site immediately otherwise we'll hunt you!";

// UPDATE
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;
    }
    try {
      // Updating the userName in all users posts. Only if userName is beeing updated.
      if (req.body.userName) {
        const user = await User.findById(req.params.id);
        if (!user) {
          res.status(404).json("user doesn't exist");
          return;
        }
        await Post.updateMany(
          { userName: user.userName },
          { userName: req.body.userName }
        );
      }

      // updating users data
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true } // in order to see the updated user and not the old one we add this QueryOpthion
      );

      res.status(200).json(updatedUser);
    } catch (err) {
      console.log({ updateUser500: err });
      res.status(500).json(err);
    }
  } else {
    //if users id in the req.body doesn't matches the :id in the params this code will be executed
    res.status(401).json(worningMessage); // Update possible on users account only!
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json("user doesn't exist");
        return;
      }
      // If we delete the user all his posts will be deleted as well
      await Post.deleteMany({ userName: user.userName });

      const deletedUser = await User.findByIdAndDelete(req.params.id);

      res.status(200).json({
        msg: "User and all his content have been deleted",
        user: deletedUser,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json(worningMessage);
  }
});

// GET USER

router.get("/:id", async (req, res) => {
  try {
    // console.log("bla bla console check....");
    const user = await User.findById(req.params.id);

    const { password, ...others } = user._doc;

    // console.log(others);
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
