const { v4: uuidv4 } = require("uuid");
const redis = require("../redis");

function getRandomRounds(min = 5, max = 15) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//4 DIGIT OTP GENERATION
function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString(); 
}

async function createRoom() {
  const roomId = uuidv4();
  const rounds = getRandomRounds();
  const otp = generateOtp();

  const roomData = {
    rounds,
    status: "waiting",
    roundResults: JSON.stringify([]),
    players: JSON.stringify([]),
    currentRound: 0, 
    createdAt: Date.now(),
    otp
  };
  console.log("rooooom data : ",roomData)

  await redis.hset(`room:${roomId}`, roomData);
  await redis.set(`otp:${otp}`, roomId);
  return {otp, roomId};
}

async function joinRoom(otp) {
  const roomId = await redis.get(`otp:${otp}`);

  if (!roomId) {
    return { error: "Invalid or expired OTP", status: 404 };
  }

  const roomKey = `room:${roomId}`;
  const roomExists = await redis.exists(roomKey);

  if (!roomExists) {
    return { error: "Room not found", status: 404 };
  }

  const players = await redis.hget(roomKey, "players");
  const parsedPlayers = players ? JSON.parse(players) : [];

  if (parsedPlayers.length >= 2) {
    return { error: "Room is full", status: 403 };
  }

  const playerId = uuidv4();
  const alias = parsedPlayers.length === 0 ? "red" : "blue";

  return {
    success: true,
    playerId,
    roomId,
    alias,
  };
}


module.exports = { createRoom,joinRoom };
