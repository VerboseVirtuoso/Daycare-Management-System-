import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠', description: 'Overview' },
    { path: '/enrollment', label: 'Our Children', icon: '⭐', description: 'Enrollment' },
    { path: '/activities', label: 'Fun Activities', icon: '🎨', description: 'Daily Fun' },
    { path: '/staff', label: 'Our Team', icon: '👥', description: 'Staff' },
    { path: '/meals', label: 'Healthy Meals', icon: '🍽️', description: 'Nutrition' },
    { path: '/communications', label: 'Messages', icon: '💬', description: 'Updates' }
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">⭐</div>
            <div>
              <h1>Little Stars</h1>
              <p className="tagline">Daycare</p>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              title={item.description}
            >
              <span className="nav-icon">{item.icon}</span>
              <div className="nav-text">
                <span className="nav-label">{item.label}</span>
                <span className="nav-description">{item.description}</span>
              </div>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

