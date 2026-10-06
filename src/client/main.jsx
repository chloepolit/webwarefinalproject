import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import GradeTracker from "./GradeTracker";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <BrowserRouter>
      <Routes> */}
        <GradeTracker/>
      {/* <Route path='/' element={<App/>} />
      <Route path='/grades' element={<GradeTracker/>} />
      </Routes>
    </BrowserRouter> */}
  </React.StrictMode>,
);
