// import React from 'react'
// // import WelcomePage from './Components/WelcomePage'
// import Login from "./Components/login.jsx";
// export default function App() {
//   return (
//     <div>
//       {/* <WelcomePage /> */}
//       <Login />
//     </div>
//   )
// }
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/login";
import Signup from "./Components/signup";
import Welcomepage from "./Components/WelcomePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Welcome" element={<Welcomepage />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </Router>
  );
}
