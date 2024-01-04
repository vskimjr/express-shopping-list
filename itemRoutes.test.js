"use strict";

const request = require("supertest");

const app = require("./app");
const { items } = require("./fakeDb");

const testItem1 = {
  name: 'testItem1',
  price: 9.99,
};

const testItem2 = {
  name: 'testItem2',
  price: 0.01,
};

const itemAdd = {
  "name": "popsicle",
  "price": 1.45
};

const testItem1Edit = {
  name: 'new testItem1',
  price: 0.02,
};

beforeEach(function () {
  items.push(testItem1);
  items.push(testItem2);
});

afterEach(function () {
  items.length = 0;
});

/** GET /items returns { items: [testItem1, testItem2]} */
describe("GET /items", function () {

  test("Gets a list of items", async function () {
    const resp = await request(app).get(`/items`);

    expect(resp.body).toEqual(
      { items: [testItem1, testItem2] }
    );
  });
});

/** GET /items/:name returns data about one item */
describe("GET /items/:name", function () {
  test("Gets a single item from item list", async function () {
    const resp = await request(app).get(`/items/${testItem1.name}`);
    expect(resp.body)
      .toEqual(testItem1);
  });

  test("Returns a 404 if item not found on list", async function () {
    const resp = await request(app).get(`/items/nonitem`);
    expect(resp.body)
      .toEqual({
        "error": {
          "message": "Not Found",
          "status": 404
        }
      });
  });
});

describe("POST /items", function () {
  test("Create a new item to item list", async function () {
    const resp = await request(app).post(`/items`).send(itemAdd);

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({ "added": itemAdd });
  });
});

describe("PATCH /items/:name", function () {
  it("Updates an item from item list", async function () {
    const resp = await request(app)
      .patch(`/items/${testItem1.name}`)
      .send(testItem1Edit);
    expect(resp.body).toEqual({ "updated": testItem1Edit });
  });
});
