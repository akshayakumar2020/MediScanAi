import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMobileSidebar } from '../../redux/uiSlice';
import Sidebar from '../sidebar/Sidebar';
import './DashboardLayout.css';

const DashboardLayout = ({ sidebarItems, sidebarTitle }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="dashboard-layout">
      <Sidebar items={sidebarItems} title={sidebarTitle} />
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button className="topbar-menu-btn" onClick={() => dispatch(toggleMobileSidebar())} aria-label="Menu">
            <span>☰</span>
          </button>
          <div className="topbar-title">
            {sidebarTitle} Portal
          </div>
          <div className="topbar-right">
            <span className="topbar-greeting">Hello, {user?.name || user?.email}</span>
            <div className="topbar-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          </div>
        </header>
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
