//Verbindet die Main und Game Page miteinander
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Game from "./pages/GamePage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
};

export default App;