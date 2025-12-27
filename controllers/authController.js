const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    // Check for existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists with this email." });
    }

    // Create user
    const newUser = new User({
      name,
      email,
      password, // In practice, hash the password before saving
      role
    });

    await newUser.save();

    // Return user without password
    const userToReturn = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };

    res.status(201).json({ user: userToReturn });
  } catch (error) {
    res.status(500).json({ message: "Server error. Could not register user.", error: error.message });
  }
};

module.exports = { register };
