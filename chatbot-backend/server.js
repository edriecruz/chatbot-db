const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(
    cors({
      origin: "http://localhost:3000", // Allow requests from your React app
      methods: ["GET", "POST"], // Allow specific HTTP methods
    })
  );
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://dbUser:dbUserPassword@cluster0.dllgj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Failed to connect to MongoDB Atlas", err));

// Define schemas
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true }, // Ensure usernames are unique
  });
  
  const messageSchema = new mongoose.Schema({
    text: String,
    sender: { type: String, required: true }, // Store username directly
    timestamp: { type: Date, default: Date.now },
  });
  
  const User = mongoose.model("User", userSchema);
  const Message = mongoose.model("Message", messageSchema);
  
  // API to register a new user
  app.post("/api/register", async (req, res) => {
    const { username } = req.body;
  
    try {
      const user = new User({ username });
      await user.save();
      res.status(201).send({ message: "User registered successfully", username });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).send({ error: "Username already exists" });
      } else {
        res.status(500).send({ error: "Failed to register user" });
      }
    }
  });
  
  // API to save a message
  app.post("/api/messages", async (req, res) => {
    const { text, sender } = req.body;
  
    try {
      const message = new Message({ text, sender });
      await message.save();
      res.status(201).send(message);
    } catch (error) {
      res.status(500).send({ error: "Failed to save message" });
    }
  });
  
  // API to fetch all messages
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await Message.find().sort({ timestamp: 1 });
      res.send(messages);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch messages" });
    }
  });
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });