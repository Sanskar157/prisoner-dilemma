const express = require("express");
const { createRoom, joinRoom } = require("../services/roomService");

const router = express.Router();

router.post("/create-room", async (req, res) => {
  try {
    const { otp, roomId } = await createRoom();
    res.status(200).json({ otp,roomId });
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ message: "Failed to create room" });
  }
});

router.post("/join-room", async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const result = await joinRoom(otp);
    if (result.error) {
      return res.status(result.status || 400).json({ message: result.error });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error joining room:", err);
    res.status(500).json({ message: "Failed to join room" });
  }
});

module.exports = router;
