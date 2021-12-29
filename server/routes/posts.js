const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const fs = require("fs");
const path = require("path");

// CREATE POST
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);

  // newPost.init().then(newPost.create(req.body, (err) => console.log(err)));

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    console.log(err.code);
    if (err.code === 11000) {
      res.status(500).json({
        err,
        msg: "This title already exists please use another title",
      });
      return;
    } else {
      res.status(500).json({ err });
    }
  }
});

// UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (req.body.userName === post.userName) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );

        res.status(200).json(updatedPost);
      } catch (err) {
        if (err.code === 11000) {
          res.status(500).json({
            msg: "This title already exists please use another title",
          });
        } else {
          res.status(500).json({ err });
        }
      }
    } else {
      res
        .status(401)
        .json({ msg: "You can't update post that doesn't belong to you." });
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res
        .status(404)
        .json({ msg: "The post you wish to delete doesn't exist" });
      return;
    }
    if (post.userName === req.body.userName) {
      // const deletedPost = await Post.findByIdAndDelete(req.params.id);
      const deletedPost = await post.delete();

      if (post.photo) {
        fs.unlink(path.join("images", post.photo), (err) => {
          if (err) {
            console.log({ errDeletingPhoto: err });
          } else {
            console.log(
              `File ${post.photo} was permenently removed from the storage`
            );
          }
        });
      }
      res.status(200).json({
        msg: "Post have been removed permenently",
        deletedPost: deletedPost,
      });
    } else {
      // Unauthorized - Ony Post ouner can delete the post
      res.status(401).json({ msg: "unable to detele the post" });
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //  console.log(post._doc);
    if (!post) {
      res.status(404).json({ msg: "This post doesn't exist." });
      return;
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// GET ALL POST
router.get("/", async (req, res) => {
  const userName = req.query.user;
  const categoryName = req.query.category;
  try {
    let posts;
    if (userName && !categoryName) {
      posts = await Post.find({ userName: userName });
    } else if (categoryName && !userName) {
      posts = await Post.find({ categories: { $in: [categoryName] } });
    } else if (userName && categoryName) {
      posts = await Post.find({
        $and: [{ userName: userName }, { categories: { $in: [categoryName] } }],
      });
    } else {
      posts = await Post.find();
    }
    //  console.log(post._doc);
    if (!posts) {
      res.status(404).json({ msg: "No posts to display." });
      return;
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
