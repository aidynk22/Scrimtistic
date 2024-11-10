import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

function LandingPage() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Scrimtistic!</h1>
        <p>This is the default landing page. Stay tuned for more updates!</p>
        <p>New to Scrimtistic?</p>
        <Link className="App-link" to="/register">Register</Link>
        <p>Already have an account?</p>
        <Link className="App-link" to="/login">Login</Link>
      </header>
    </div>
  );
}

function RegisterPage() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Register for Scrimtistic!</h1>
        <p>This is the register page.</p>
        <Link className="App-link" to="/">Back</Link>
      </header>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Login to Scrimtistic!</h1>
        <p>This is the login page.</p>
        <Link className="App-link" to="/">Back</Link>
      </header>
    </div>
  );
}

function HomePage() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Scrimtistic</h1>
        <p>This is the home page.</p>
        <Link className="App-link" to="/displayMatches">Display Matches</Link>
        <Link className="App-link" to="/addMatches">Add Matches</Link>
        <Link className="App-link" to="/displayFullMatches">Display Full Matches</Link>
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
        <Link className="App-link" to="/home">Home</Link>
        <Link className="App-link" to="/addMatches">Add Matches</Link>
        <Link className="App-link" to="/displayFullMatches">Display Full Match</Link>
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
        <Link className="App-link" to="/home">Home</Link>
        <Link className="App-link" to="/displayMatches">Display Matches</Link>
        <Link className="App-link" to="/displayFullMatches">Display Full Matches</Link>
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
        <Link className="App-link" to="/home">Home</Link>
        <Link className="App-link" to="/addMatches">Add Matches</Link>
        <Link className="App-link" to="/displayMatches">Display Matches</Link>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/addMatches" element={<AddMatchesPage />} />
        <Route path="/displayMatches" element={<DisplayMatchesPage />} />
        <Route path="/displayFullMatch" element={<DiplayFullMatchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
