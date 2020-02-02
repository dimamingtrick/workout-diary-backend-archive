const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models");
const { validateEmail } = require("../helpers");
const { PASSWORD_HASH, JWT_PRIVATE_KEY } = require("../config");

class UserError {
  constructor(field, message) {
    this.field = field;
    this.message = message;
  }
}

exports.signup = async (req, res) => {
  try {
    const { email, name, password, confirmPassword } = req.body;

    let errors = [];
    if (!email) {
      errors.push(new UserError("email", "Email is required"));
    }

    if (email && !validateEmail(email)) {
      errors.push(new UserError("email", "Email is not valid"));
    }

    const emailInUse = await UserModel.findOne({ email });
    if (emailInUse) {
      errors.push(new UserError("email", "Email is already in usage"));
    }

    if (!name) {
      errors.push(new UserError("name", "Name is required"));
    }

    if (!password) {
      errors.push(new UserError("password", "Password is required"));
    }

    if (!confirmPassword) {
      errors.push(new UserError("confirmPassword", "Confirm your password"));
    }

    if (password && confirmPassword && password !== confirmPassword) {
      errors.push(new UserError("confirmPassword", "Passwords doesn't match"));
    }

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    let hashedPassword = "";
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      throw error;
    }

    const user = new UserModel({
      email,
      name,
      password: hashedPassword
    });

    try {
      await user.save();
    } catch (err) {
      throw err;
    }

    const token = jwt.sign({ _id: user._id }, JWT_PRIVATE_KEY, {
      expiresIn: "1h"
    });

    const userObject = user.toObject(); // Convert user into object to remove password before sending response
    delete userObject.password;

    return res.json({ user: userObject, token });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Error, try again later" });
  }
};

exports.signin = async (req, res) => {
  console.log("hey", req.body);
  try {
    res.json({ message: "Sign in" });
  } catch (err) {
    console.log(err);
  }
};
