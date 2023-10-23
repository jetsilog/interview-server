const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(bodyParser.json());

let counter = 0;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/counter", (req, res) => {
  res.json({ counter });
});

app.patch("/counter", (req, res) => {
  const { newCounterValue } = req.body;
  counter = newCounterValue;

  io.emit("counterUpdate", counter);
  res.sendStatus(200);
});

io.on("connection", (socket) => {
  socket.emit("counterUpdate", counter);
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
