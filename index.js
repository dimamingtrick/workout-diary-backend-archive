require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { jwtMiddleware } = require("./middlewares");

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/workout-diary";

app.set("socket.io");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * API routes
 */
app.use(require("./routes/auth.routes"));
app.use("/workout", jwtMiddleware, require("./routes/workout.routes"));

app.get("/", (req, res) => {
  res.send("YEAH BOY");
});

app.get("*", (req, res) => {
  res.status(404).send("Not found");
});

async function start() {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    server.listen(PORT, () => {
      console.log(`Server is working on port ${PORT}`);

      io.on("connection", socket => {
        app.set("socket", socket);
      });
    });
  } catch (err) {
    console.log("Start error: ", err.message);
  }
}

start();
