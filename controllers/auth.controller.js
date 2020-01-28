exports.signin = async (req, res) => {
  try {
    res.json({ message: "Sign in" });
  } catch (err) {
    console.log(err);
  }
};

exports.signup = async (req, res) => {
  try {
    res.json({ message: "Sign up" });
  } catch (err) {
    console.log(err);
  }
};
