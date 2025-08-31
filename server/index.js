import express from "express";
import { createServer } from "node:http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.json());
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173", // React frontend
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
  email: { type: String, required: true, maxlength: 100, unique: true },
  password: { type: String, required: true, maxlength: 100, minlength: 6 },
  name: { type: String },
  timeStamp: { type: Date, required: true, default: Date.now },
  friends: { type: Array, default: [] },
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
      timeStamp: new Date(),
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
  console.log("Login successful, token set in cookie");
  res.json({ message: "Login successful", userName: user.name });
});
const authMiddleware = (req, res, next) => {
  // must show { token: "<jwt>" }
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.userId = decoded.id;
      req.user = decoded.user;
      console.log("Authenticated user:", req.user);
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  }
};

app.get("/protectedRoute", authMiddleware, (req, res) => {
  res.json({
    message: "You are logged in!",
    userId: req.id,
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
  const suggestions = await User.find(
    { _id: { $ne: req.user.id } }, // exclude logged in user
    "name email" // include only these fields (projection
  )
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(suggestions);
});

//socket io connection
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React app
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("⚡ New user connected:", socket.id);

  socket.on("sendMessage", (msg) => {
    // broadcast message to everyone
    io.emit("receiveMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
