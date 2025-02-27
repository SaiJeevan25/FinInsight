import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcomepage from "./Components/WelcomePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcomepage />} />
      </Routes>
    </Router>
  );
}
