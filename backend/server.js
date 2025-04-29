const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const redis = require("./redis");
const roomRoutes = require("./routes/room");

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use("/api", roomRoutes);

// Local map to track socket -> room  
const socketToRoom = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // on joining a room
  socket.on("joinRoom", async ({ roomId, playerId, alias }, callback) => {
    try {
      const roomKey = `room:${roomId}`;
      const roomExists = await redis.exists(roomKey);

      if (!roomExists) {
        return callback({ error: "Room does not exist" });
      }

      socket.join(roomId);
      socketToRoom.set(socket.id, roomId);
      await redis.set(`socket:${socket.id}`, playerId);

      const room = await redis.hgetall(roomKey);
      const players = JSON.parse(room.players || "[]");

      if (players.length > 2) {
        return callback({ error: "Room is full" });
      }

      players.push({ id: socket.id, alias });

      await redis.hmset(roomKey, {
        players: JSON.stringify(players),
        status: players.length === 2 ? "full" : "waiting"
      });

      // io.to(roomId).emit("playerJoined", { alias, players });
      // console.log("Players length ==>",players.length)
      if (players.length === 2) {
        setTimeout(() => {
          io.to(roomId).emit("gameStart", { message: "Game is starting!" });
          console.log("game starts now !!!!!!!!!!");
        }, 3000);
      }

      callback({ success: true });

    } catch (err) {
      console.error("Error in socket joinRoom:", err);
      callback({ error: "Failed to join room" });
    }
  });

  socket.on("playerMove", async ({ roomId, alias, move }) => {
    console.log("playerMove ---->" ,roomId ,alias ,move)
    try {
      const roomKey = `room:${roomId}`;
      const room = await redis.hgetall(roomKey);
      if (!room || !room.status) return;

      const currentRound = parseInt(room.currentRound || "0", 10);
      const roundResults = JSON.parse(room.roundResults || "[]");

      let currentRoundData = roundResults.find(r => r.round === currentRound);
      if (!currentRoundData) {
        currentRoundData = { round: currentRound, moves: {} };
        roundResults.push(currentRoundData);
      }

      currentRoundData.moves[alias] = move;

      if (currentRoundData.moves.red && currentRoundData.moves.blue) {
        const redMove = currentRoundData.moves.red;
        const blueMove = currentRoundData.moves.blue;

        console.log("red move -->",redMove)
        console.log("blue move -->",blueMove)

        const payoff = {
          Cooperate: { Cooperate: [2, 2], Betray: [-1, 3] },
          Betray: { Cooperate: [3, -1], Betray: [0, 0] },
        };

        const [redScore, blueScore] = payoff[redMove][blueMove];
        currentRoundData.result = { red: redScore, blue: blueScore };

        const nextRound = currentRound + 1;
        const totalRounds = parseInt(room.rounds);

        await redis.hmset(roomKey, {
          roundResults: JSON.stringify(roundResults),
          currentRound: nextRound,
        });

        
          io.to(roomId).emit("roundResult", {
            round: currentRound,
            result: currentRoundData.result,
            moves: currentRoundData.moves,
          });  
        
        
        if (nextRound >= totalRounds) {
          io.to(roomId).emit("gameOver", { rounds: roundResults });
        }
      } else {
        await redis.hmset(roomKey, {
          roundResults: JSON.stringify(roundResults),
        });
      }

    } catch (err) {
      console.error("Error handling player move:", err);
    }
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);
    const roomId = socketToRoom.get(socket.id);
    if (!roomId) return;

    const roomKey = `room:${roomId}`;
    const room = await redis.hgetall(roomKey);
    if (!room || !room.players) return;

    let players = JSON.parse(room.players);
    const disconnectedPlayer = players.find(p => p.id === socket.id);
    const alias = disconnectedPlayer?.alias;

    players = players.filter(p => p.id !== socket.id);

    if (players.length === 0) {
      await redis.del(roomKey);
      console.log(`Room ${roomId} deleted due to empty player list`);
    } else {
      await redis.hmset(roomKey, {
        players: JSON.stringify(players),
        status: "waiting"
      });

      io.to(roomId).emit("playerLeft", {
        alias,
        players,
        message: "Other player disconnected. Waiting for someone to join...",
      });
    }

    socketToRoom.delete(socket.id);
    await redis.del(`socket:${socket.id}`);
  });
});


app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/test-redis", async (req, res) => {
  await redis.set("test-key", "hello from redis");
  const value = await redis.get("test-key");
  res.send({ value });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
