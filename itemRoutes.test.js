"use strict";

const request = require("supertest");

const app = require("./app")
const { items } = require("./fakeDb");

const testItem1 = {
  name: 'testItem1',
  price: 9.99,
}

const testItem2 = {
  name: 'testItem2',
  price: 0.01,
}

beforeEach(function() {
  items.push(testItem1);
  items.push(testItem2);
});

afterEach(function() {
  items.length = 0;
});

describe("GET /items", function() {

  test("Gets a list of items", async function() {
    const resp = await request(app).get(`/items`);

    expect(resp.body).toEqual(
      { items: [testItem1, testItem2]}
    )
  });

});