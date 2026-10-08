import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Login from "./Login";
import PomodoroTimer from "./Timer";
import ReadingTrack from "./ReadingTracker";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/timer" element={<PomodoroTimer />} />
        <Route path="/reading-tracker" element={<ReadingTrack />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
