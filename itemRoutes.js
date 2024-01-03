
const express = require("express");

const { items } = require("./fakeDb");
const router = new express.Router();

/** Returns list list of shopping items */
router.get("/", function (req, res) {
  return res.json({ items });
})


module.exports = router;