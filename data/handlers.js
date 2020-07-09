const { users } = require("./users");

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
    res.redirect(`../users/${currentUser._id}`);
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
//sign out function
const handleSignOut = (req, res) => {
  currentUser = {};
  friendsIds = [];
  res.redirect("/");
};

module.exports = {
  handleFourOhFour,
  handleHomepage,
  handleName,
  handleProfilePage,
  handleSignin,
  handleSignOut,
};
