import React from 'react'
import WelcomePage from './Components/WelcomePage'
import SignUp from './Components/SignUp'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
