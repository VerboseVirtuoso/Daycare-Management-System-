import { useState } from 'react';
import { useDaycare } from './context/DaycareContext';
import { useToast } from './context/ToastContext';
import './StaffSchedule.css';

export default function StaffSchedule() {
  const { state, addStaff, updateStaff, deleteStaff } = useDaycare();
  const { showToast } = useToast();
  const { staff } = state;
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [scheduleEntry, setScheduleEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    role: ''
  });
  const [staffFormData, setStaffFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: ''
  });

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentWeek = getWeekDates(selectedDate);

  function getWeekDates(dateString) {
    const date = new Date(dateString);
    const day = date.getDay();
    const diff = date.getDate() - day;
    const weekStart = new Date(date.setDate(diff));
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      week.push(d.toISOString().split('T')[0]);
    }
    return week;
  }

  const getStaffScheduleForDate = (staffId, date) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember || !staffMember.schedule) return null;
    return staffMember.schedule.find(s => s.date === date);
  };

  const handleSubmitSchedule = async (e) => {
    e.preventDefault();
    const staffMember = staff.find(s => s.id === selectedStaff);
    let updatedSchedule;

    if (editingSchedule) {
      // Update existing schedule entry
      updatedSchedule = staffMember.schedule.map(s =>
        (s.id === editingSchedule.id || s._id === editingSchedule._id) ? { ...scheduleEntry, id: s.id || s._id } : s
      );
    } else {
      // Add new schedule entry
      updatedSchedule = [...(staffMember.schedule || []), { ...scheduleEntry, id: `sch${Date.now()}` }];
    }

    try {
      await updateStaff(selectedStaff, { ...staffMember, schedule: updatedSchedule });
      showToast(editingSchedule ? 'Schedule updated successfully' : 'Schedule added successfully', 'success');
    } catch (error) {
      showToast('Failed to update schedule', 'error');
    }

    setShowForm(false);
    setSelectedStaff(null);
    setEditingSchedule(null);
  };

  const handleEditSchedule = (staffId, schedule) => {
    setSelectedStaff(staffId);
    setEditingSchedule(schedule);
    setScheduleEntry(schedule);
    setShowForm(true);
  };

  const handleDeleteSchedule = async (staffId, scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule entry?')) {
      const staffMember = staff.find(s => s.id === staffId);
      const updatedSchedule = staffMember.schedule.filter(s => s.id !== scheduleId && s._id !== scheduleId);

      try {
        await updateStaff(staffId, { ...staffMember, schedule: updatedSchedule });
        showToast('Schedule deleted successfully', 'success');
      } catch (error) {
        showToast('Failed to delete schedule', 'error');
      }
    }
  };

  const handleSubmitStaff = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await updateStaff(editingStaff.id, staffFormData);
        showToast('Staff member updated successfully', 'success');
        setEditingStaff(null);
      } else {
        await addStaff(staffFormData);
        showToast('Staff member added successfully', 'success');
      }
      setShowStaffForm(false);
      setStaffFormData({ name: '', role: '', email: '', phone: '' });
    } catch (error) {
      showToast('Operation failed', 'error');
    }
  };

  const handleEditStaff = (staffMember) => {
    setEditingStaff(staffMember);
    setStaffFormData(staffMember);
    setShowStaffForm(true);
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await deleteStaff(id);
        showToast('Staff member deleted successfully', 'success');
      } catch (error) {
        showToast('Failed to delete staff member', 'error');
      }
    }
  };

  const resetStaffForm = () => {
    setStaffFormData({ name: '', role: '', email: '', phone: '' });
  };

  return (
    <div className="staff-schedule">
      <div className="page-header">
        <div>
          <h1>👥 Our Caring Team</h1>
          <p>Meet our wonderful staff and manage their schedules</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="date-selector">
            <label>Week of:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
            />
          </div>
          <button className="btn-primary" onClick={() => { setShowStaffForm(true); setEditingStaff(null); resetStaffForm(); }}>
            ⭐ Add Team Member
          </button>
        </div>
      </div>

      {showStaffForm && (
        <div className="modal-overlay" onClick={() => { setShowStaffForm(false); setEditingStaff(null); resetStaffForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}</h2>
              <button className="close-btn" onClick={() => { setShowStaffForm(false); setEditingStaff(null); resetStaffForm(); }}>×</button>
            </div>
            <form onSubmit={handleSubmitStaff} className="schedule-form">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  required
                  value={staffFormData.name}
                  onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <input
                  type="text"
                  required
                  value={staffFormData.role}
                  onChange={(e) => setStaffFormData({ ...staffFormData, role: e.target.value })}
                  placeholder="e.g., Lead Teacher, Assistant Teacher"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={staffFormData.email}
                    onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    required
                    value={staffFormData.phone}
                    onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => { setShowStaffForm(false); setEditingStaff(null); resetStaffForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">{editingStaff ? 'Update Staff' : 'Add Staff'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => { setShowForm(false); setSelectedStaff(null); setEditingSchedule(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSchedule ? 'Edit Schedule Entry' : 'Add Schedule Entry'}</h2>
              <button className="close-btn" onClick={() => { setShowForm(false); setSelectedStaff(null); setEditingSchedule(null); }}>×</button>
            </div>
            <form onSubmit={handleSubmitSchedule} className="schedule-form">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  required
                  value={scheduleEntry.date}
                  onChange={(e) => setScheduleEntry({ ...scheduleEntry, date: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Time *</label>
                  <input
                    type="time"
                    required
                    value={scheduleEntry.startTime}
                    onChange={(e) => setScheduleEntry({ ...scheduleEntry, startTime: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>End Time *</label>
                  <input
                    type="time"
                    required
                    value={scheduleEntry.endTime}
                    onChange={(e) => setScheduleEntry({ ...scheduleEntry, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Role/Notes</label>
                <input
                  type="text"
                  value={scheduleEntry.role}
                  onChange={(e) => setScheduleEntry({ ...scheduleEntry, role: e.target.value })}
                  placeholder="e.g., Lead Teacher, Morning Shift"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setSelectedStaff(null); setEditingSchedule(null); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">{editingSchedule ? 'Update Schedule' : 'Add Schedule'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="staff-list">
        {staff.map(staffMember => (
          <div key={staffMember.id} className="staff-card">
            <div className="staff-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3>{staffMember.name}</h3>
                  <p className="staff-role">{staffMember.role}</p>
                  <p className="staff-contact">{staffMember.email} • {staffMember.phone}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-edit" onClick={() => handleEditStaff(staffMember)} style={{ padding: '6px 12px', fontSize: '14px' }}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDeleteStaff(staffMember.id)} style={{ padding: '6px 12px', fontSize: '14px' }}>Delete</button>
                </div>
              </div>
            </div>
            <div className="schedule-calendar">
              <div className="calendar-header">
                {daysOfWeek.map((day, index) => (
                  <div key={index} className="calendar-day-header">
                    <div className="day-name">{day.substring(0, 3)}</div>
                    <div className="day-date">
                      {new Date(currentWeek[index]).getDate()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="calendar-grid">
                {currentWeek.map((date, index) => {
                  const schedule = getStaffScheduleForDate(staffMember.id, date);
                  return (
                    <div key={index} className="calendar-cell">
                      {schedule ? (
                        <div className="schedule-entry" style={{ position: 'relative' }}>
                          <div className="schedule-time">
                            {schedule.startTime} - {schedule.endTime}
                          </div>
                          {schedule.role && (
                            <div className="schedule-role">{schedule.role}</div>
                          )}
                          <div style={{ marginTop: '8px', display: 'flex', gap: '4px' }}>
                            <button
                              className="btn-edit-small"
                              onClick={() => handleEditSchedule(staffMember.id, schedule)}
                              style={{ padding: '4px 8px', fontSize: '12px' }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn-delete-small"
                              onClick={() => handleDeleteSchedule(staffMember.id, schedule.id)}
                              style={{ padding: '4px 8px', fontSize: '12px' }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="add-schedule-btn"
                          onClick={() => {
                            setSelectedStaff(staffMember.id);
                            setScheduleEntry({
                              date: date,
                              startTime: '09:00',
                              endTime: '17:00',
                              role: ''
                            });
                            setShowForm(true);
                          }}
                        >
                          +
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {staff.length === 0 && (
        <div className="empty-state-large">
          <p>No staff members added yet. Add staff members to manage schedules.</p>
        </div>
      )}
    </div>
  );
}
