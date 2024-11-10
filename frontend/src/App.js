import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Register from './pages/register';
import Login from './pages/login';
import Welcome from './pages/welcome';

function HomePage() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Scrimtastic</h1>
        <p>This is the home page.</p>
        <div className="nav-links">
          <Link className="App-link" to="/displayMatches">Display Matches</Link>
          <Link className="App-link" to="/addMatches">Add Matches</Link>
          <Link className="App-link" to="/displayFullMatch">Display Full Matches</Link>
        </div>
      </header>
    </div>
  );
}

function DisplayMatchesPage() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Match History</h1>
        <p>This is the Display Matches page.</p>
        <div className="nav-links">
          <Link className="App-link" to="/home">Home</Link>
          <Link className="App-link" to="/addMatches">Add Matches</Link>
          <Link className="App-link" to="/displayFullMatch">Display Full Match</Link>
        </div>
      </header>
    </div>
  );
}

function AddMatchesPage() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Add Matches</h1>
        <p>This is the Add Match page.</p>
        <div className="nav-links">
          <Link className="App-link" to="/home">Home</Link>
          <Link className="App-link" to="/displayMatches">Display Matches</Link>
          <Link className="App-link" to="/displayFullMatch">Display Full Matches</Link>
        </div>
      </header>
    </div>
  );
}

function DiplayFullMatchPage() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Full Match</h1>
        <p>This is the Full Match page.</p>
        <div className="nav-links">
          <Link className="App-link" to="/home">Home</Link>
          <Link className="App-link" to="/addMatches">Add Matches</Link>
          <Link className="App-link" to="/displayMatches">Display Matches</Link>
        </div>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/addMatches" element={<AddMatchesPage />} />
        <Route path="/displayMatches" element={<DisplayMatchesPage />} />
        <Route path="/displayFullMatch" element={<DiplayFullMatchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
