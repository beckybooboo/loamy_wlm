const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const googleClientID = process.env.GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID;
const client = new OAuth2Client(googleClientID);
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/greeting", authenticateToken, (req, res) => {
  try {
    res.json({
      email: `${req.user.email}`,
      picture: `${req.user.picture}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Route to handle Google Sign-In
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleClientID,
    });
    const payload = ticket.getPayload(); // This object includes user's information
    // Extract user details
    const { sub: googleId, email, picture } = payload;

    // Attempt to find the user by googleId
    let user = await User.findOne({ googleId });

    if (user) {
      // If user exists and picture is different, update it
      if (user.picture !== picture) {
        user.picture = picture;
        await user.save();
      }
    } else {
      // If user doesn't exist, create a new one
      user = new User({ googleId, email, picture });
      await user.save();
    }

    const userPayload = {
      id: user._id,
      email: user.email,
      picture: user.picture,
    };

    const jwtToken = jwt.sign(
      userPayload,
      process.env.JWT_SECRET, // Ensure you have a JWT_SECRET in your .env
      { expiresIn: "24h" } // Token expires in 24 hours
    );

    res.json({
      message: "User logged in/registered successfully",
      user: userPayload,
      token: jwtToken,
    });
  } catch (error) {
    console.error("Authentication failed:", error);
    res
      .status(401)
      .json({ message: "Authentication failed", error: error.toString() });
  }
});

module.exports = router;
