import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Chatbot.css";

const API_URL = process.env.REACT_APP_API_URL;

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [registered, setRegistered] = useState(false);

  // Fetch messages on component mount
  useEffect(() => {
    if (registered) {
      console.log("Fetching messages...");
      fetchMessages();
    }
  }, [registered]);

  // Fetch all messages
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  // Handle username registration
  const handleRegister = async () => {
    if (username.trim() === "") return;

    try {
      const response = await axios.post(`${API_URL}/api/register`, { username });
      alert(response.data.message); // Notify user of successful registration
      setRegistered(true);
    } catch (error) {
      if (error.response && error.response.data.error) {
        alert(error.response.data.error); // Show error message
      } else {
        console.error("Failed to register username", error);
      }
    }
  };

  // Handle sending a message
  const sendMessage = async () => {
    if (input.trim() === "") return;

    try {
      const message = { text: input, sender: username };
      await axios.post(`${API_URL}/api/messages`, message);
      setInput("");
      fetchMessages(); // Refresh messages
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  // Render registration form if not registered
  if (!registered) {
    return (
      <div className="login-container">
        <h1>Chat App</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <button onClick={handleRegister}>Register</button>
      </div>
    );
  }

  // Render chat interface
  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender === username ? "user" : "other"}`}>
            <strong>{message.sender}:</strong> {message.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;