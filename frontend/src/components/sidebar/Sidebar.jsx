import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { closeMobileSidebar } from '../../redux/uiSlice';
import './Sidebar.css';

const Sidebar = ({ items, title }) => {
  const { user } = useSelector((state) => state.auth);
  const { sidebarMobileOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleLinkClick = () => {
    dispatch(closeMobileSidebar());
  };

  return (
    <>
      {sidebarMobileOpen && <div className="sidebar-overlay" onClick={() => dispatch(closeMobileSidebar())} />}
      <aside className={`sidebar ${sidebarMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo-icon">🏥</span>
          <span className="sidebar-logo-text">MediScan <span>AI</span></span>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">{user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'User'}</div>
            <div className="sidebar-user-role">{user?.role}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">{title || 'Menu'}</div>
          {items.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-text">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
            <span className="sidebar-link-icon">🚪</span>
            <span className="sidebar-link-text">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
