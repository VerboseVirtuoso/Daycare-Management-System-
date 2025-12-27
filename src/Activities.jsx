import { useState } from 'react';
import { useDaycare } from './context/DaycareContext';
import { useToast } from './context/ToastContext';
import './Activities.css';

export default function Activities() {
  const { state, addActivity, updateActivity, deleteActivity } = useDaycare();
  const { showToast } = useToast();
  const { children, activities } = state;
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const today = new Date().toLocaleDateString('en-CA');
  const [selectedDate, setSelectedDate] = useState(today);
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString('en-CA'),
    childId: '',
    activityType: '',
    description: '',
    duration: 30,
    notes: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  const filteredActivities = activities.filter(a => {
    if (a.date !== selectedDate) return false;
    if (searchTerm === '') return true;
    const child = children.find(c => c.id === a.childId || c._id === a.childId);
    return (
      a.activityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (child && child.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const activityTypes = [
    'Playtime',
    'Arts & Crafts',
    'Story Time',
    'Music & Dance',
    'Outdoor Play',
    'Nap Time',
    'Meal Time',
    'Learning Activity',
    'Free Play',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingActivity) {
        await updateActivity(editingActivity.id, formData);
        showToast('Activity updated successfully', 'success');
        setEditingActivity(null);
      } else {
        await addActivity(formData);
        showToast('Activity logged successfully', 'success');
      }
      setShowForm(false);
      resetForm();
    } catch (error) {
      showToast(error.message || 'Failed to save activity', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      date: selectedDate,
      childId: '',
      activityType: '',
      description: '',
      duration: 30,
      notes: ''
    });
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormData(activity);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await deleteActivity(id);
        showToast('Activity deleted successfully', 'success');
      } catch (error) {
        showToast(error.message || 'Failed to delete activity', 'error');
      }
    }
  };

  return (
    <div className="activities">
      <div className="page-header">
        <div>
          <h1>🎨 Fun Activities</h1>
          <p>Record the amazing activities our little stars enjoy each day</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(true); setEditingActivity(null); resetForm(); }}>
          ✨ Log Fun Activity
        </button>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="date-filter">
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
          />
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => { setShowForm(false); setEditingActivity(null); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingActivity ? 'Edit Activity' : 'Log New Activity'}</h2>
              <button className="close-btn" onClick={() => { setShowForm(false); setEditingActivity(null); resetForm(); }}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="activity-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Child *</label>
                  <select
                    required
                    value={formData.childId}
                    onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
                  >
                    <option value="">Select a child</option>
                    {children.filter(c => c.status === 'active').map(child => (
                      <option key={child.id || child._id} value={child.id || child._id}>{child.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Activity Type *</label>
                  <select
                    required
                    value={formData.activityType}
                    onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                  >
                    <option value="">Select type</option>
                    {activityTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration (minutes) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  placeholder="Describe the activity..."
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="2"
                  placeholder="Additional notes or observations..."
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditingActivity(null); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingActivity ? 'Update Activity' : 'Log Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="activities-list">
        {filteredActivities.length > 0 ? (
          filteredActivities.map(activity => {
            const childId = activity.childId?._id || activity.childId;
            const child = children.find(c => (c.id === childId || c._id === childId));
            return (
              <div key={activity._id || activity.id} className="activity-card">
                <div className="activity-card-header">
                  <div>
                    <h3>{activity.activityType || activity.title}</h3>
                    <p className="activity-child-name">{child?.name || 'Unknown Child'}</p>
                  </div>
                  <div className="activity-meta">
                    <span className="activity-duration">{activity.duration || 30} min</span>
                    <span className="activity-time">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="activity-description">
                  <p>{activity.description}</p>
                </div>
                {activity.notes && (
                  <div className="activity-notes">
                    <strong>Notes:</strong> {activity.notes}
                  </div>
                )}
                <div className="activity-actions" style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                  <button className="btn-edit" onClick={() => handleEdit(activity)} style={{ padding: '6px 12px', fontSize: '14px' }}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(activity._id || activity.id)} style={{ padding: '6px 12px', fontSize: '14px' }}>Delete</button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state-large">
            <p>No activities recorded for this date. Click "Log Activity" to add one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
