const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");

const {
  postSignup,
  getUserById,
  doLogin,
  updateUserInfo,
  forgetPassword,
} = require("../../controls/auth/auth");

//Create new user
router.post("/signup", postSignup);

//Login
router.post("/login", doLogin);

//Get user by id
router.get("/find/:uid", getUserById);

//Forget Password
router.get("/forgetPassword/:email", forgetPassword);

//Update Profile
router.post(
  "/profile/update",
  fileUpload({ createParentPath: true }),
  updateUserInfo
);

module.exports = router;
