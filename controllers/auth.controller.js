const bcrypt = require("bcrypt");
const { UserModel } = require("../models");
const { validateEmail, generateJwt } = require("../helpers");

class AuthError {
  constructor(field, message) {
    this.field = field;
    this.message = message;
  }
}

/**
 * GET "/me"
 * jwtMiddleware
 * Returns current user by jwt
 */
exports.getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userId);
    res.send({ user });
  } catch (err) {
    res.status(400).json({ message: err.message || "Error, try again" });
  }
};

/**
 * POST "/sign-up"
 */
exports.signUp = async (req, res) => {
  try {
    const { email, name, password, confirmPassword } = req.body;

    let errors = [];
    if (!email) {
      errors.push(new AuthError("email", "Email is required"));
    }

    if (email && !validateEmail(email)) {
      errors.push(new AuthError("email", "Email is not valid"));
    }

    const emailInUse = await UserModel.findOne({ email });
    if (emailInUse) {
      errors.push(new AuthError("email", "Email is already in usage"));
    }

    if (!name) {
      errors.push(new AuthError("name", "Name is required"));
    }

    if (!password) {
      errors.push(new AuthError("password", "Password is required"));
    }

    if (!confirmPassword) {
      errors.push(new AuthError("confirmPassword", "Confirm your password"));
    }

    if (password && confirmPassword && password !== confirmPassword) {
      errors.push(new AuthError("confirmPassword", "Passwords doesn't match"));
    }

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    let hashedPassword = "";
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    const user = new UserModel({
      email,
      name,
      password: hashedPassword
    });

    try {
      await user.save();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    const token = generateJwt(user._id);

    const userObject = user.toObject(); // Convert user into object to remove password before sending response
    delete userObject.password;

    return res.json({ user: userObject, token });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message || "Error, try again" });
  }
};

/**
 * POST "/sign-in"
 * Sign in by email and password
 */
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    let errors = [];
    if (!email) {
      errors.push(new AuthError("email", "Email is required"));
    }

    if (email && !validateEmail(email)) {
      errors.push(new AuthError("email", "Email is not valid"));
    }

    if (!password) {
      errors.push(new AuthError("password", "Password is required"));
    }

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const user = await UserModel.findOne({ email }).select("+password");

    if (!user)
      return res
        .status(404)
        .json([new AuthError("email", "User doesn't exist")]);

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res
        .status(400)
        .json([new AuthError("password", "Wrong password")]);
    }

    const token = generateJwt(user._id);

    const userData = user.toObject(); // Convert user into object to remove password before sending response
    delete userData.password;

    res.json({ user: userData, token });
  } catch (err) {
    res.status(400).json({ message: err.message || "Error, try again" });
  }
};
