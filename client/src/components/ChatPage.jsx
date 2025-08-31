import { use, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useApp } from "../context/conext1";
import { useLocation } from "react-router-dom";

const socket = io("http://localhost:5000");
const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { user } = useApp();

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const friendId = queryParams.get("friendId");
  const name = queryParams.get("name");

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [msg, ...prev]);
      console.log(msg);
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const msg = { text: message, sender: user };
      socket.emit("sendMessage", msg); // send to server
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

      <div className="flex-1 border overflow-y-auto p-4 space-y-reverse bg-amber-300 flex flex-col-reverse">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === user ? "justify-end" : ""}`}
          >
            <p
              className={`px-4 py-2 ${
                msg.sender === user
                  ? "bg-black text-white"
                  : "bg-white text-black"
              } rounded-lg my-1`}
            >
              {msg.text}
            </p>
          </div>
        ))}
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
          onClick={() => {
            sendMessage();
          }}
        />
      </div>
    </div>
  );
};
export default ChatPage;
