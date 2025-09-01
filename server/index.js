import express from "express";
import { createServer } from "node:http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { type } from "node:os";

const app = express();
app.use(cookieParser());
app.use(express.json());
dotenv.config();

app.use(
  cors({
    origin: "https://chatting-app-client-8bru.onrender.com", // React frontend
    methods: ["GET", "POST"],
    credentials: true, // ✅ allow cookies
  })
);

//mongoDB connection
try {
  await mongoose.connect(process.env.CONNECTION_STRING);
  console.log("connected DB");
} catch (e) {
  console.error(e);
  process.exit(1);
}

//user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, maxlength: 100 },
  password: { type: String, required: true, maxlength: 100, minlength: 6 },
  name: { type: String },
  friends: { type: [{ id: String, name: String }], default: [], unique: true },
});
const User = mongoose.model("users", userSchema);
// api routes
app.post("/userSignUp", async (req, res) => {
  try {
    const { email, password, userName } = req.body;
    const newUser = new User({
      email,
      password,
      name: userName,
      friends: [],
    });
    await newUser.save();
    res.send({ message: "User added sucessfully" });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      res.status(400).send({ message: "invalid input" });
    } else {
      res.status(500).send({ messaage: "internal server error" });
    }
  }
});

app.post("/userSignIn", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res.send({ message: "Unsucessful" });
  }

  const token = jwt.sign(
    { id: user._id, user: user.name },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // must be false on localhost
    sameSite: "lax", // or "none" + secure:true if cross-origin POST
    maxAge: 3600000,
  });
  res.json({
    message: "Login successful",
    userName: user.name,
    userId: user._id,
  });
});
const authMiddleware = (req, res, next) => {
  // must show { token: "<jwt>" }
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.userId = decoded.id;
      req.user = decoded.user;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  }
};

app.get("/protectedRoute", authMiddleware, (req, res) => {
  res.json({
    message: "You are logged in!",
    userId: req.userId,
    user: req.user,
  });
});

//for logout
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // true in production
    sameSite: "lax",
  });
  res.json({ message: "Logged out" });
});

//get friend suggestions
app.get("/friendSuggestions", authMiddleware, async (req, res) => {
  const userFriends = await User.findById(req.userId).select("friends");
  const friendsIds = userFriends.friends.map((friend) => friend._id);
  const suggestions = await User.find({
    _id: { $nin: [...friendsIds, req.userId] }, // exclude logged in user
    // include only these fields (projection)
  })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(suggestions);
});
//add friend
app.post("/addFriend", authMiddleware, async (req, res) => {
  try {
    const { _id, name, email } = req.body;
    const userId = req.userId; // from JWT middleware

    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        friends: { _id: _id, name: name, email: email },
      },
    });

    res.json({ success: true, message: "Friend added!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get friends list
app.get("/friends", authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//socket io connection
// server.js

// ... (keep all your other code like express, mongoose, etc.)

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chatting-app-client-8bru.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// To send a message to a specific user, we need to know their socket.id.
// This is a simple way to map a user ID to a socket ID.
const users = {};

io.on("connection", (socket) => {
  console.log(`A user connected with ID: ${socket.id}`);

  // When a user logs in, they should emit their userId to the server
  socket.on("register", (userId) => {
    users[userId] = socket.id;
    console.log("Registered users:", users);
  });

  // Listen for a private message
  socket.on("private_message", ({ recipientId, message }) => {
    // Look up the recipient's socket.id
    const recipientSocketId = users[recipientId];

    if (recipientSocketId) {
      // Send the message only to that specific user
      io.to(recipientSocketId).emit("private_message", {
        senderId: socket.id, // Or the sender's userId
        message: message,
      });
    }
  });

  socket.on("disconnect", () => {
    // Clean up the users object on disconnect
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
      }
    }
    console.log("A user disconnected. Registered users:", users);
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy 🚀",
    timestamp: new Date().toISOString(),
  });
});

//routes from /routes
import previousChat from "./routes/previousChat.js";
app.use("/chat", previousChat);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
