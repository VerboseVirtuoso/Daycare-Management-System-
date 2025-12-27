import { useState, useEffect } from 'react'
import { useDaycare } from './context/DaycareContext'
import './Communications.css'

export default function Communications() {
  const { state, addAnnouncement } = useDaycare()
  const { communications } = state

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
  })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const body = {
        title: formData.title,
        message: formData.message,
        date: new Date().toISOString(),
      }
      await addAnnouncement(body)
      setShowForm(false)
      setFormData({ title: '', message: '' })
    } catch (err) {
      setError(err.message || 'Error sending announcement.')
    }
    setSubmitting(false)
  }

  return (
    <div className="communications">
      <div className="page-header">
        <div>
          <h1>💬 Family Updates</h1>
          <p>Stay connected with families and share important updates</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>💬 Send Announcement</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Announcement</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="communication-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter announcement title"
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="5"
                  placeholder="Enter your announcement..."
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Announcement'}
                </button>
              </div>
              {error && (
                <div className="form-error" style={{ color: 'red', marginTop: 8 }}>
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <div className="communications-list">
        {communications.length > 0 ? (
          communications.map((comm) => (
            <div key={comm._id} className={`communication-card announcement`}>
              <div className="comm-card-header">
                <div>
                  <span className="comm-type-badge announcement">Announcement</span>
                  <h3>{comm.title}</h3>
                </div>
                <div className="comm-date-time">
                  <div>{new Date(comm.date).toLocaleDateString()}</div>
                  <div className="comm-time">{new Date(comm.date).toLocaleTimeString()}</div>
                </div>
              </div>
              <div className="comm-message-content">
                <p>{comm.message}</p>
              </div>
              {/* Remove/Hide Delete and Recipient Footer -- announcements are now backend managed and for all parents */}
              <div className="comm-footer">
                <span className="comm-recipients">
                  📢 Sent to all parents
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state-large">
            <p>No announcements sent yet. Click "Send Announcement" to send your first announcement.</p>
          </div>
        )}
      </div>
    </div>
  )
}
