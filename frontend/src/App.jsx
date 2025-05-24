import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homepage";
import PlanetPage from "./pages/planets/planets";
import AsteroidPage from "./pages/astriods/astroidpage";
import CometPage from "./pages/comet/cometpage";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signup";
import Header from "./components/header";
import Quiz from "./pages/quiz";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/header" element={<Header />} />
        <Route path="/planets" element={<PlanetPage />} />
        <Route path="/asteroid" element={<AsteroidPage />} />
        <Route path="/comet" element={<CometPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;

{/*
  import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authcontext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/header';
import Home from './pages/homepage';
import Planets from './pages/planets/planets';
import Asteroids from './pages/astriods/astroidpage';
import Comets from './pages/comet/cometpage';
import Quiz from './pages/quiz';
import Login from './pages/auth/login';
// import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/planets" element={<Planets />} />
          <Route path="/asteroids" element={<Asteroids />} />
          <Route path="/comets" element={<Comets />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
  */}