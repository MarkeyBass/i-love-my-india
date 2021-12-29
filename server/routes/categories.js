const router = require("express").Router();
const Category = require("../models/Category");

// Create Category
router.post("/", async (req, res) => {
  const newCat = new Category(req.body);
  try {
    const savedCat = await newCat.save();
    res.status(200).json(savedCat);
  } catch (err) {
    if (err.code === 11000) {
      res.status(500).json({ msg: "This category name already exist." });
    }
    console.log(err);
    res.status(500).json(err);
  }
});

// Fetch All Categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    if (!categories) {
      res.status(500).json({
        msg: "Unable to find any categories",
      });
    }
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
