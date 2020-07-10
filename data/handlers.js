const { users } = require("./users");

let currentUser = {};
let currentUserIndex = null;
let friendsIds = []; //used for ribbon css ribbon class on homepage.ejs

// 404 FUNCTION
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};
// HOMEPAGE
const handleHomepage = (req, res) => {
  res.status(200);
  res.render("pages/homepage", { users, currentUser, friendsIds });
};
// PROFILE PAGE
const handleProfilePage = (req, res) => {
  let id = req.params.id;
  let index = null;
  let friendList = []; // to keep track of currentUser's friends
  //getting index of this profile's user using Id
  users.forEach((user) => {
    if (id === user._id) {
      index = users.indexOf(user);
    }
  });
  //grabbing the user profile object from users array and adding user's friends to friendlist array
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
      id,
    });
  } else {
    res.status(404).send("I couldn't find what you're looking for.");
  }
};
//SIGN IN PAGE
const handleSignin = (req, res) => {
  if (currentUser._id) {
    res.redirect(`../users/${currentUser._id}`);
  } else {
    res.render("pages/signin", { currentUser });
  }
};
// SIGN IN FUNCTION
const handleName = (req, res) => {
  const firstName = req.body.firstName;
  currentUser = users.find((user) => {
    return user.name === firstName;
  });
  //if name entered matches a user un users array, we store the object in currentUser
  if (currentUser) {
    currentUserIndex = users.indexOf(currentUser); // we store the current user's index in users array
    currentUser.friends.forEach((friend) => {
      friendsIds.push(friend); //we update the friendsIds array as well
    });
    res.status(200);
    res.redirect(`/users/${currentUser._id}`);
  } else {
    res.status(400);
    res.redirect("/signin");
  }
};
//SIGN OUT FUNCTION
const handleSignOut = (req, res) => {
  currentUser = {};
  currentUserIndex = null;
  friendsIds = [];
  res.redirect("/");
};
//LOGIC TO ADD BFF <3
const handleAddFriend = (req, res) => {
  let profileId = req.params.id;
  let profileIndex = null;
  currentUser.friends.forEach((user) => {
    if (user._id === profileId) {
      profileIndex = users.indexOf(user);
    }
  });
  //if user is signed in, currentUser should be an object with at least the name property
  if (currentUser.name) {
    //if profile id matches an id from the user's friends array then they're already friends
    let alreadyFriends = currentUser.friends.some((friend) => {
      return friend === profileId;
    });
    //if already friends, then remove this friend
    if (alreadyFriends) {
      friendsIds = currentUser.friends.filter((friend) => {
        return friend !== profileId;
      });
      //we have to update the user object from the users array
      users[currentUserIndex].friends = friendsIds;

      //if not friends yet, then add as friend
    } else {
      //since currentUser is a reference to the user object in users array, we only need to update this variable
      currentUser.friends.push(profileId);
    }
  }
  res.redirect(`../users/${profileId}`);
};
module.exports = {
  handleFourOhFour,
  handleHomepage,
  handleName,
  handleProfilePage,
  handleSignin,
  handleSignOut,
  handleAddFriend,
};
