import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

import { Routes, Route } from "react-router-dom";
import UserAuthToggle from "./components/userAuthToggle";
import { AppProvider } from "./context/conext1";
import Home from "./components/Home";
import ChatPage from "./components/ChatPage";

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatPage" element={<ChatPage />} />
        <Route path="/authentication" element={<UserAuthToggle />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
