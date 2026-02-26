import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./Dashboard";
import Representatives from "./Representatives";
import Updates from "./Updates";
import Issues from "./Issues";
import NewsPage from "./pages/NewsPage.jsx";
import NewsTicker from "./temp2/NewsTicker.jsx";
import Login from "./temp2/Login.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

import "./App.css";
import "./temp2/Login.css";

import { FaUserCircle, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

const AppContent = () => {
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  function handleProfileClick() {
    setShowModal(true);
  }

  function handleSignUpClick() {
    setShowModal(true);
  }

  function handleLoginSuccess() {
    setShowModal(false);
  }

  function closeModal() {
    setShowModal(false);
  }

  function toggleMenu() {
    setMenuOpen((v) => !v);
  }

  function handleLogout() {
    logout();
    setShowModal(false);
  }

  return (
    <BrowserRouter>
      <div className="app-root">
        <header className="site-header">
          <div className="header-inner">
            <div className="logo">
              <Link to="/" onClick={() => setMenuOpen(false)} aria-label="CitizenConnect home">
                <span className="logo-mark">🟣</span>
                <span className="logo-text">CitizensConnect</span>
              </Link>
            </div>

            <nav className={`main-nav ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
              <ul>
                <li><Link to="/" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
                <li><Link to="/issues" onClick={() => setMenuOpen(false)}>Issues</Link></li>
                <li><Link to="/representatives" onClick={() => setMenuOpen(false)}>Representatives</Link></li>
                <li><Link to="/updates" onClick={() => setMenuOpen(false)}>Updates</Link></li>
              </ul>
            </nav>

            <div className="header-actions">
              {!user ? (
                <button className="signup-btn" onClick={handleSignUpClick}>Login</button>
              ) : (
                <div className="user-menu">
                  <span className="user-role">{user.role}</span>
                  <button className="icon-btn" onClick={handleProfileClick} aria-label="Open profile">
                    <FaUserCircle size={26} />
                  </button>
                </div>
              )}

              <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle menu">
                {menuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </header>

        <main className="site-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/representatives" element={<Representatives />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/news/:id" element={<NewsPage />} />
          </Routes>
        </main>

        {showModal && (
          <div className="modal-overlay" role="dialog" aria-modal="true" onClick={closeModal}>
            <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
              {!user ? (
                <Login onSuccess={handleLoginSuccess} onCancel={() => setShowModal(false)} />
              ) : (
                <ProfileView user={user} onClose={() => setShowModal(false)} onLogout={handleLogout} />
              )}
            </div>
          </div>
        )}

        <NewsTicker />
      </div>
    </BrowserRouter>
  );
};

function SignUpForm({ onSignUp, onCancel }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Citizen");

  function submit(e) {
    e.preventDefault();
    onSignUp({ name, email, role });
  }

  return (
    <form className="modal-form" onSubmit={submit}>
      <h3 className="modal-title">Sign Up</h3>

      <label className="field">
        <span className="field-label">Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>

      <label className="field">
        <span className="field-label">Email</span>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      </label>

      <label className="field">
        <span className="field-label">Role</span>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option>Citizen</option>
          <option>Politician</option>
          <option>Reporter</option>
        </select>
      </label>

      <div className="modal-actions">
        <button type="submit" className="btn-primary">Create account</button>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function ProfileView({ user, onClose, onLogout }) {
  return (
    <div className="profile-view">
      <h3 className="modal-title">Profile</h3>
      <div className="profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        {user.aadharNumber && <p><strong>Aadhar:</strong> ****{user.aadharNumber.slice(-4)}</p>}
        {user.employeeId && <p><strong>Employee ID:</strong> {user.employeeId}</p>}
        {user.department && <p><strong>Department:</strong> {user.department}</p>}
        {user.designation && <p><strong>Designation:</strong> {user.designation}</p>}
        {user.party && <p><strong>Party:</strong> {user.party}</p>}
        {user.constituency && <p><strong>Constituency:</strong> {user.constituency}</p>}
      </div>
      <div className="profile-actions">
        <button className="btn-ghost" onClick={onLogout}>
          <FaSignOutAlt style={{ marginRight: 8 }} />
          Logout
        </button>
        <button className="btn-primary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;