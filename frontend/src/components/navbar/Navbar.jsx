import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { getDashboardPath } from '../../utils/roleUtils';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏥</span>
          <span className="logo-text">MediScan <span className="logo-ai">AI</span></span>
        </Link>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <a href="#features" className="navbar-link" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#how-it-works" className="navbar-link" onClick={() => setMenuOpen(false)}>How It Works</a>
          <a href="#pricing" className="navbar-link" onClick={() => setMenuOpen(false)}>Pricing</a>
          <a href="#doctors" className="navbar-link" onClick={() => setMenuOpen(false)}>For Doctors</a>

          {isAuthenticated ? (
            <div className="navbar-auth">
              <Link to={getDashboardPath(user?.role)} className="btn btn-ghost" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="navbar-link" onClick={() => setMenuOpen(false)}>Register</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </div>
          )}
        </div>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`hamburger ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
