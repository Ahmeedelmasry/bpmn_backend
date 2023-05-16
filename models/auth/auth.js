const mongoose = require("mongoose");
const { isEmail } = require("validator");

const signupSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email address"],
    unique: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  profileImg: String,
});

//Custom Loggin Function
signupSchema.statics.login = async function (email, password) {
  let user = await this.findOne({ email });
  if (user) {
    const comparePass = password == user.password ? true : false;
    if (comparePass) {
      return user;
    }
    return {
      error: {
        email: "",
        password: "Incorrect password",
      },
    };
  }
  return {
    error: {
      email: "Email not found",
      password: "",
    },
  };
};

module.exports = mongoose.model("users", signupSchema);
