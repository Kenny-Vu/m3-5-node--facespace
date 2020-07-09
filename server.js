"use strict";

const express = require("express");
const morgan = require("morgan");

const {
  handleFourOhFour,
  handleHomepage,
  handleName,
  handleProfilePage,
  handleSignin,
  handleSignOut,
} = require("./data/handlers");

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
  .get("/signout", handleSignOut)
  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
