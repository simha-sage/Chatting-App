import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useApp } from "../context/conext1";
import { useLocation } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { userId } = useApp();

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const friendId = queryParams.get("friendId");
  const name = queryParams.get("name");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(`${apiUrl}`, {
      withCredentials: true,
    });

    // Register logged-in user with backend
    socketRef.current.emit("register", userId);

    // Listen for private messages
    socketRef.current.on("private_message", ({ senderId, message }) => {
      setMessages((prev) => [{ text: message, sender: senderId }, ...prev]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    try {
      const previousData = async () => {
        const res = await fetch(
          `${apiUrl}/chat/getPreviousChat?userId=${userId}&friendId=${friendId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await res.json();
        setMessages(data);
      };
      previousData();
    } catch (err) {
      console.log(err);
    }
  }, [friendId]);
  const saveChatHistory = async (chatMessages) => {
    // Don't save if there are no messages
    if (chatMessages.length === 0) return;

    try {
      await fetch(`${apiUrl}/chat/updatePreviousChat`, {
        // Use your full backend URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          friendId: friendId,
          messageStore: chatMessages, // Send the final array of messages
        }),
      });
      console.log("Chat history saved successfully.");
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  };

  useEffect(() => {
    // This return function is the "cleanup" function.
    // It runs when the component is about to unmount (e.g., user navigates away).
    saveChatHistory(messages);
  }, [messages, userId, friendId]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socketRef.current?.emit("private_message", {
        recipientId: friendId,
        message,
      });

      // Add to local chat window
      setMessages((prev) => [{ text: message, sender: userId }, ...prev]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen border w-5/12 m-auto">
      <div className="flex gap-4 p-4 bg-gray-200 items-center">
        <div className="bg-amber-500 w-12 h-12 border rounded-full"></div>
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-sm text-gray-500">{friendId}</p>
        </div>
      </div>

      <div className="flex-1 border overflow-y-auto p-4 bg-amber-300 flex flex-col-reverse">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === userId ? "justify-end" : ""}`}
          >
            <p
              className={`px-4 py-2 ${
                msg.sender === userId
                  ? "bg-black text-white"
                  : "bg-white text-black"
              } rounded-lg my-1`}
            >
              {msg.text}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="flex gap-2 p-2 border-t bg-white">
        <input
          type="text"
          name="message"
          className="flex-1 border px-4 py-2 rounded-md"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="button"
          value="Send"
          className="bg-amber-400 px-4 py-2 rounded-md font-black"
          onClick={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatPage;
