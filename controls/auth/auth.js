require("dotenv").config();
const SignUp = require("../../models/auth/auth");
const nodemailer = require("nodemailer");
const path = require("path");

//Handle Errors
const handleErrs = (err) => {
  let error = { userName: "", email: "", password: "" };
  if (err.errors) {
    Object.values(err.errors).forEach((err) => {
      error[err.path] = err.message;
    });
  }
  if (err.code === 11000) {
    error.email = "This email already exists, try another email";
  }
  return error;
};

const postSignup = async (req, res) => {
  try {
    let newUser = await SignUp.create({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      profileImg: "",
    });
    delete newUser.password;
    res.json(newUser);
  } catch (error) {
    const errRes = handleErrs(error);
    res.status(401).json({ errors: errRes });
  }
};

const doLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const logging = await SignUp.login(email, password);
  let sendUser = new Object(logging);

  if (logging.error) {
    res.status(401).json(logging);
  } else {
    sendUser.password = "";
    res.status(201).json(sendUser);
  }
};

const getUserById = async (req, res) => {
  let user = await SignUp.findOne({ _id: req.params.uid });
  if (user) {
    user.password = "";
  }
  res.json(user);
};

const updateUserInfo = async (req, res) => {
  const user = await SignUp.findById(req.body._id);
  let reqBody = req.body;
  const reqFiles = req.files;
  let errors = {
    userName: "",
    email: "",
    oldPass: "",
    newPass: "",
  };
  if (!reqBody.userName) {
    errors.userName = "Please enter your Name";
    return res.status(400).json(errors);
  }
  if (!reqBody.email) {
    errors.email = "Please enter your Email";
    return res.status(400).json(errors);
  }
  if (!reqBody.oldPass) {
    errors.oldPass = "Please enter your Old Password";
    return res.status(400).json(errors);
  }
  if (!reqBody.newPass) {
    errors.newPass = "Please enter your new password";
    return res.status(400).json(errors);
  }
  if (reqBody.newPass.length < 6) {
    errors.newPass = "New Password should be at least 6 characters";
    return res.status(400).json(errors);
  }
  if (reqBody.oldPass != user.password) {
    errors.oldPass = "Old password is incorrect";
    return res.status(400).json(errors);
  }
  if (!reqFiles) {
    await SignUp.updateOne(
      { _id: reqBody._id },
      {
        $set: {
          userName: reqBody.userName,
          email: reqBody.email,
          password: reqBody.newPass,
        },
      }
    );
    return res.json({ message: "Profile Updated Successfully!" });
  } else {
    // Upload Photo
    const fileName = `${Date.now()}.jpg`;
    const filePath = path.join(__dirname, "../../profileImgs", fileName);
    reqFiles.imgFile.mv(filePath, (err) => {
      if (err)
        return res.status(500).json({ status: "error", message: "error" });
    });
    reqBody.profileImg = `${process.env.BACKEND_HOST}/${fileName}`;
    await SignUp.updateOne(
      { _id: reqBody._id },
      {
        $set: {
          userName: reqBody.userName,
          email: reqBody.email,
          password: reqBody.newPass,
          profileImg: reqBody.profileImg,
        },
      }
    );
    return res.json({ message: "Profile Updated Successfully!" });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const getUser = await SignUp.findOne({ email: req.params.email });
    if (!getUser) {
      return res.status(404).json({ error: "User Not Found" });
    } else {
      const randChars = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        0,
        "!",
        "@",
        "#",
        "$",
        "%",
        "^",
        "&",
        "*",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
      ];
      let newArr = [];
      for (let i = 0; i < 30; i++) {
        const rand = Math.floor(Math.random() * randChars.length);
        newArr.push(randChars[rand]);
      }
      const finalToken = newArr.join("");
      await SignUp.updateOne(
        { email: req.params.email },
        { password: finalToken }
      );
      //Send Email
      const from = "Questionizer MTS Website";
      const to = getUser.email;
      const subject = "New Password Set";
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "appuniversee@gmail.com",
          pass: "xyfokczyflxnxpeq",
        },
      });
      const mailOptions = {
        from,
        to,
        subject,
        text: `Hello ${getUser.userName},
         Your new password is (${finalToken}), You can use it now to login to Bpmn website`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          return res
            .status(400)
            .json({ error: "Something went wrong, Please try again" });
        } else {
          return res.json({
            message: "A new password has been sent to your email",
          });
        }
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Something went wrong, please try again" });
  }
};

module.exports = {
  postSignup,
  forgetPassword,
  getUserById,
  doLogin,
  updateUserInfo,
};
