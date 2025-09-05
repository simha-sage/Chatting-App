import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

import { Routes, Route } from "react-router-dom";
import UserAuthToggle from "./components/userAuthToggle";
import { AppProvider } from "./context/conext1";
import Home from "./components/Home";
import ChatPage from "./components/ChatPage";
import DashBoard from "./components/DashBoard";

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<DashBoard />}>
          <Route index element={<Home />} />
          <Route path="/profile" element={<div>Profile Page</div>} />
        </Route>
        <Route path="/chatPage" element={<ChatPage />} />
        <Route path="/authentication" element={<UserAuthToggle />} />

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </AppProvider>
  );
}

export default App;
