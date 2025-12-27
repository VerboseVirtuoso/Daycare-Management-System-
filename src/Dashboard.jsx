import { useDaycare } from './context/DaycareContext';
import './Dashboard.css';

export default function Dashboard() {
  const { state } = useDaycare();
  const { children, staff, activities, meals, communications } = state;

  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
  const todayActivities = activities.filter(a => a.date === today);
  const todayMeals = meals.filter(m => m.date === today);
  const recentCommunications = communications.slice(-3).reverse();

  // Filter active children correctly
  const activeChildren = children.filter(c => (c.status || 'active') === 'active').length;
  const greeting = getGreeting();

  const stats = [
    {
      label: 'Little Stars',
      sublabel: 'Active Children',
      value: activeChildren,
      icon: '⭐',
      color: '#FFD700',
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
    },
    {
      label: 'Caring Team',
      sublabel: 'Staff Members',
      value: staff.length,
      icon: '👥',
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      label: 'Fun Today',
      sublabel: 'Activities',
      value: todayActivities.length,
      icon: '🎨',
      color: '#f093fb',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      label: 'Updates',
      sublabel: 'Messages',
      value: communications.length,
      icon: '💬',
      color: '#4facfe',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>{greeting}! 🌟</h1>
          <p className="subtitle">Here's what's happening at Little Stars Daycare today</p>
        </div>
        <div className="date-display">
          <div className="date-day">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
          <div className="date-full">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ '--stat-color': stat.color, '--stat-gradient': stat.gradient }}>
            <div className="stat-icon-wrapper">
              <div className="stat-icon">{stat.icon}</div>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-sublabel">{stat.sublabel}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header-with-icon">
            <span className="card-icon">🎨</span>
            <h2>Today's Fun Activities</h2>
          </div>
          {todayActivities.length > 0 ? (
            <div className="activity-list">
              {todayActivities.slice(0, 5).map(activity => {
                const child = children.find(c => c.id === activity.childId || c._id === activity.childId);
                return (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-header">
                      <span className="activity-type">{activity.activityType}</span>
                      <span className="activity-time">{activity.duration} min</span>
                    </div>
                    <div className="activity-child">{child?.name || 'Unknown'}</div>
                    <div className="activity-description">{activity.description}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="empty-state">No activities recorded for today</p>
          )}
        </div>

        <div className="dashboard-card">
          <div className="card-header-with-icon">
            <span className="card-icon">🍽️</span>
            <h2>Today's Healthy Meals</h2>
          </div>
          {todayMeals.length > 0 ? (
            <div className="meal-list">
              {todayMeals.map(meal => (
                <div key={meal.id} className="meal-item">
                  <div className="meal-type">{meal.mealType.toUpperCase()}</div>
                  <div className="meal-menu">{meal.menu}</div>
                  {meal.allergens.length > 0 && (
                    <div className="meal-allergens">
                      Allergens: {meal.allergens.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No meals planned for today</p>
          )}
        </div>

        <div className="dashboard-card">
          <div className="card-header-with-icon">
            <span className="card-icon">💬</span>
            <h2>Family Updates</h2>
          </div>
          {recentCommunications.length > 0 ? (
            <div className="communication-list">
              {recentCommunications.map(comm => (
                <div key={comm.id} className="communication-item">
                  <div className="comm-header">
                    <span className="comm-type">{comm.type}</span>
                    <span className="comm-date">
                      {new Date(comm.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="comm-title">{comm.title}</div>
                  <div className="comm-message">{comm.message}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No recent communications</p>
          )}
        </div>
      </div>
    </div>
  );
}

