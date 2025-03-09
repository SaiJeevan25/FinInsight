import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from './Components/WelcomePage';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import NotFound from './Components/NotFound';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
