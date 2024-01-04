"use strict";

//TODO: Create a route folder containing all the route files. This will be helpful for larger projects

const express = require("express");

const { items } = require("./fakeDb");
const { BadRequestError } = require("./expressError");
const { isNumber } = require("lodash");

const router = new express.Router();

//TODO: you can also have a middleware folder and import it from the files in the folder

/** Middleware function to validate json body input */

function validateItemBody(req, res, next) {
  if (req.body === undefined) {
    throw new BadRequestError('No input data recieved');
  }

  if (req.body.name === undefined || req.body.price === undefined) {
    throw new BadRequestError('Name and Price are required fields.');
  }

  if (!isNumber(req.body.price)) {
    throw new BadRequestError('Price must be a number.');
  }

  return next();
}

/** Returns list of shopping items */

router.get("/", function (req, res) {
  return res.json({ items });
});

//TODO: provide data output shapes in the docstring of what exactly you will get back
/** Return a single shopping item */

router.get("/:name", function (req, res, next) {
  //FIXME: don't use the for loop. Update to findIndex like we did below
  // get first match for input name
  for (const item of items) {
    if (item.name === req.params.name) {
      return res.json(item);
    }
  }
  //FIXME: We shouldn't need to call next(). We need an additional check.
  //If there is no item, throw an error. Its always better to be explicit. This should be done first

  // use next to give 404 if no match for name
  next();
});

/** Add an item to items and return it */

router.post("/", validateItemBody, function (req, res) {
  console.log('body input for adding item:', req.body);

  if (items.findIndex(item => item.name === req.body.name) !== -1) {
    throw new BadRequestError('Item name is already taken.');
  }

  const newItem = {
    name: req.body.name,
    price: req.body.price,
  };
  items.push(newItem);


  return res.status(201).json({ added: newItem });
});

/** Modifies name, price or both of an item on list and returns item */

router.patch("/:name", validateItemBody, function (req, res, next) {

  const itemIdx = items.findIndex(item => item.name === req.params.name);

  if (itemIdx !== -1) {

    // check for rename, make sure not renaming to taken name
    if (req.body.name !== req.params.name
      && items.findIndex(item => item.name === req.body.name) !== -1){
        throw new BadRequestError('Item name is already taken.');
      }

    items[itemIdx].name = req.body.name;
    items[itemIdx].price = req.body.price;
    return res.json({ updated: items[itemIdx] });
  }

  //FIXME: Look above and don't call next(). We need to return something or throw an error
  // use next to give 404 if no match for name
  next();
});

/** Delete item from list */

router.delete("/:name", function (req, res, next) {

  const itemIdx = items.findIndex(item => item.name === req.params.name);

  if (itemIdx !== -1) {
    items.splice(itemIdx, 1);
    return res.json({ message: "Deleted" });
  }

  // use next to give 404 if no match for name
  next();
});

module.exports = router;