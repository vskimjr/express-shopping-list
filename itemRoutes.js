
const express = require("express");

const { items } = require("./fakeDb");
const { BadRequestError } = require("./expressError");
const { isNumber } = require("lodash");

const router = new express.Router();

/** Returns list of shopping items */

router.get("/", function (req, res) {
  return res.json({ items });
});

/** Return a single shopping item */

router.get("/:name", function (req, res, next) {

  // get first match for input name
  for (const item of items) {
    if (item.name === req.params.name) {
      return res.json(item);
    }
  }

  // use next to give 404 if no match for name
  next();
});

/** Add an item to items and return it */

router.post("/", function (req, res) {
  console.log('body input for adding item:', req.body);

  if (req.body === undefined) {
    throw new BadRequestError('No input data recieved');
  }

  if (req.body.name === undefined || req.body.price === undefined) {
    throw new BadRequestError('Name and Price are required fields.');
  }

  if (!isNumber(req.body.price)) {
    throw new BadRequestError('Price must be a number.');
  }

  const newItem = {
    name: req.body.name,
    price: req.body.price,
  };
  items.push(newItem);

  return res.json({ added: newItem });

});

/** Modifies name, price or both of an item on list and returns item */

router.patch("/:name", function (req, res, next) {

  if (req.body === undefined) {
    throw new BadRequestError('No input data recieved');
  }

  if (req.body.name === undefined || req.body.price === undefined) {
    throw new BadRequestError('Name and Price are required fields.');
  }

  if (!isNumber(req.body.price)) {
    throw new BadRequestError('Price must be a number.');
  }

  for (const item of items) {
    if (item.name === req.params.name) {
      item.name = req.body.name;
      item.price = req.body.price;
      return res.json({ updated: item});
    }
  }

  // use next to give 404 if no match for name
  next();
});

/** Delete item from list */

router.delete("/:name", function (req, res, next) {

  const itemIdx =  items.findIndex(item => req.params.name === item.name)

  //TODO: Ask about this
  if (itemIdx === -1){
    next();
  } else {
    items.splice(itemIdx, 1)
    return res.json({message: "Deleted"});
  }

})

module.exports = router;