import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

function DashboardLayout({ links, role }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/login');
  };

  const homepagePath =
    role === 'owner'
      ? '/ownerdashboard/ownerhome'
      : '/userdashboard/userhome';

  const isActive = (path) => location.pathname === path;

  const sidebarStyle = {
    width: '250px',
    background: 'linear-gradient(to bottom, #3b82f6, #1e3a8a)',
    color: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  };

  const buttonBaseStyle = {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '10px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'white',
    cursor: 'pointer',
    marginBottom: '8px',
  };

  const activeButtonStyle = {
    backgroundColor: '#1e40af',
    borderLeft: '4px solid white',
    fontWeight: 'bold',
  };

  const logoutButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#dc2626',
    marginTop: 'auto',
  };

  const logoutHoverStyle = {
    backgroundColor: '#b91c1c',
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>PAYROLL SYSTEM</h2>

        {/* Home Button */}
        <button
          onClick={() => navigate(homepagePath)}
          style={{
            ...buttonBaseStyle,
            ...(isActive(homepagePath) ? activeButtonStyle : {}),
          }}
        >
          Home
        </button>

        {/* Dynamic Sidebar Links */}
        {links.map(({ name, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              ...buttonBaseStyle,
              ...(isActive(path) ? activeButtonStyle : {}),
            }}
          >
            {name}
          </button>
        ))}

        {/* Spacer for pushing logout to bottom */}
        <div style={{ flexGrow: 1 }}></div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={logoutButtonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = logoutHoverStyle.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = logoutButtonStyle.backgroundColor)}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
