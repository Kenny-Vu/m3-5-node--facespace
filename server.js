"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};
// homepage
const handleHomepage = (req, res) => {
  res.status(200);
  res.render("pages/homepage", { users: users });
};
// user page
const handleProfilePage = (req, res) => {
  const id = req.params.id;
  let index = null;
  users.forEach((user) => {
    if (id === user._id) {
      index = users.indexOf(user);
    }
  });
  if (index !== null) {
    const user = users[index];
    const friendList = [];
    users.forEach((possibleFriend) => {
      user.friends.forEach((friend) => {
        if (friend === possibleFriend._id) {
          friendList.push(possibleFriend);
        }
      });
    });
    console.log(friendList);
    res.render("pages/profile", { user, friendList });
  } else {
    res.status(404).send("I couldn't find what you're looking for.");
  }
};

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .get("/", handleHomepage)
  .get("/users/:id", handleProfilePage)
  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
