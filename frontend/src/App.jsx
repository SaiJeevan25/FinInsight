import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcomepage from "./Components/WelcomePage";
import SignUp from './Components/SignUp'
import Login from './Components/Login'
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcomepage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}
