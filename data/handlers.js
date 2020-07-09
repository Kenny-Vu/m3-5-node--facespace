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
  let id = req.params.id;
  currentIdVisit = id;
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
      currentIdVisit,
      id,
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
//logic to add BFF <3
const handleAddFriend = (req, res) => {
  let profileId = req.params.id;
  console.log(profileId);
  //if user is signed in, currentUser should have the name property
  if (currentUser.name) {
    let alreadyFriends = currentUser.friends.some((friend) => {
      return friend === profileId;
    });
    console.log(alreadyFriends);
    if (alreadyFriends) {
      let newFriends = currentUser.friends.filter((friend) => {
        return friend !== profileId;
      });
      currentUser.friends = newFriends;
      friendsIds = newFriends;
    } else {
      friendsIds.push(profileId);
      currentUser.friends.push(profileId);
    }
  }
  res.redirect(`../users/${profileId}`);
};
module.exports = {
  currentUser,
  friendsIds,
  handleFourOhFour,
  handleHomepage,
  handleName,
  handleProfilePage,
  handleSignin,
  handleSignOut,
  handleAddFriend,
};
