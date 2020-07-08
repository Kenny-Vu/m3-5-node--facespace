"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};
let friendsIds = [];

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};
// homepage
const handleHomepage = (req, res) => {
  res.status(200);
  res.render("pages/homepage", { users, currentUser, friendsIds });
};
// user page
const handleProfilePage = (req, res) => {
  const id = req.params.id;
  const friendList = [];
  let index = null;
  users.forEach((user) => {
    if (id === user._id) {
      index = users.indexOf(user);
    }
  });
  if (index !== null) {
    const user = users[index];
    users.forEach((possibleFriend) => {
      user.friends.forEach((friend) => {
        if (friend === possibleFriend._id) {
          friendList.push(possibleFriend);
        }
      });
    });
    res.render("pages/profile", {
      user,
      friendList,
      currentUser,
    });
  } else {
    res.status(404).send("I couldn't find what you're looking for.");
  }
};
//sign in page
const handleSignin = (req, res) => {
  if (currentUser._id) {
    res.redirect("../");
  } else {
    res.render("pages/signin", { currentUser });
  }
};
// sign in function
const handleName = (req, res) => {
  const firstName = req.body.firstName;
  let match = users.find((user) => {
    return user.name === firstName;
  });
  if (match) {
    currentUser = match;
    match.friends.forEach((friend) => {
      friendsIds.push(friend);
    });
    console.log(friendsIds);
    res.status(200);
    res.redirect(`/users/${match._id}`);
  } else {
    res.status(400);
    res.redirect("/signin");
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
  .get("/signin", handleSignin)
  .post("/getname", handleName)
  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
