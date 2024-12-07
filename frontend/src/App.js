import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Register from './pages/register';
import Login from './pages/login';
import Welcome from './pages/welcome';
import HomePage from './pages/home';
import AddMatches from './pages/add_matches';
import DisplayMatch from './pages/display_match';

function AppContent() {
  const location = useLocation();
  const noHeaderPaths = ['/', '/login', '/register'];
  const showHeader = !noHeaderPaths.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route exact path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/addMatches" element={<AddMatches />} />
        <Route path="/match/:matchId" element={<DisplayMatch />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
