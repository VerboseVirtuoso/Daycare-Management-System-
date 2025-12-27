import { useState } from 'react';
import { useDaycare } from './context/DaycareContext';
import { useToast } from './context/ToastContext';
import './Enrollment.css';

export default function Enrollment() {
  const { state, dispatch, addChild, updateChild, deleteChild } = useDaycare();
  const { showToast } = useToast();
  const { children } = state;
  const [showForm, setShowForm] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    allergies: '',
    emergencyContact: '',
    status: 'active'
  });

  const filteredChildren = children.filter(child => {
    const matchesSearch = searchTerm === '' ||
      child.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (child.parentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (child.parentEmail || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (child.status || 'active') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const validateForm = () => {
    if (!formData.name.trim()) {
      showToast('Please enter the child\'s name', 'error');
      return false;
    }
    if (!formData.age || parseInt(formData.age) < 0 || parseInt(formData.age) > 12) {
      showToast('Please enter a valid age (0-12)', 'error');
      return false;
    }
    if (!formData.gender) {
      showToast('Please select a gender', 'error');
      return false;
    }
    if (!formData.parentName.trim()) {
      showToast('Please enter the parent/guardian name', 'error');
      return false;
    }
    if (!formData.parentPhone.trim()) {
      showToast('Please enter the parent phone number', 'error');
      return false;
    }
    if (!formData.parentEmail.trim() || !formData.parentEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return false;
    }
    if (!formData.emergencyContact.trim()) {
      showToast('Please enter emergency contact information', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    if (editingChild) {
      try {
        // Transform form data to match backend requirements
        const childId = editingChild._id || editingChild.id;
        const backendData = {
          name: formData.name.trim(),
          age: parseInt(formData.age),
          gender: formData.gender,
          admissionDate: formData.enrollmentDate,
          medicalNotes: formData.allergies || '',
          status: formData.status || 'active'
        };

        await updateChild(childId, backendData);
        showToast('Child information updated successfully', 'success');
        setEditingChild(null);
      } catch (error) {
        showToast(error.message || 'Failed to update child', 'error');
        return;
      }
    } else {
      try {
        let parentId;
        try {
          const createParentResponse = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.parentName.trim(),
              email: formData.parentEmail.trim(),
              password: 'TempPass123!',
              role: 'parent'
            }),
          });

          const parentResponseData = await createParentResponse.json().catch(() => ({}));

          if (createParentResponse.ok && parentResponseData.user?._id) {
            parentId = parentResponseData.user._id;
          } else if (createParentResponse.status === 409) {
            showToast('Parent with this email already exists. Please use a different email or contact admin.', 'error');
            return;
          } else {
            throw new Error(parentResponseData.message || 'Failed to create parent user');
          }
        } catch (parentError) {
          if (parentError.message.includes('Failed to fetch') || parentError.message.includes('CORS')) {
            showToast('Cannot connect to server. Please check if backend is running and CORS is configured.', 'error');
            return;
          }
          throw parentError;
        }

        if (!parentId) {
          throw new Error('Could not obtain parent ID');
        }

        const backendData = {
          name: formData.name.trim(),
          age: parseInt(formData.age),
          gender: formData.gender,
          parentId: parentId,
          admissionDate: formData.enrollmentDate,
          medicalNotes: formData.allergies || '',
          status: formData.status || 'active'
        };

        await addChild(backendData);
        showToast('Child enrolled successfully', 'success');
      } catch (error) {
        const errorMessage = error.message || 'Failed to enroll child. Please check console for details.';
        showToast(errorMessage, 'error');
        return;
      }
    }
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      gender: 'male',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
      allergies: '',
      emergencyContact: '',
      status: 'active'
    });
  };

  const handleEdit = (child) => {
    setEditingChild(child);
    setFormData(child);
    setShowForm(true);
  };

  const handleDelete = async (child) => {
    if (window.confirm('Are you sure you want to remove this child from enrollment?')) {
      try {
        const childId = child._id || child.id;
        await deleteChild(childId);
        showToast('Child removed from enrollment', 'success');
      } catch (error) {
        showToast(error.message || 'Failed to delete child', 'error');
      }
    }
  };

  return (
    <div className="enrollment">
      <div className="page-header">
        <div>
          <h1>⭐ Our Little Stars</h1>
          <p>Welcome new families and manage our wonderful children</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(true); setEditingChild(null); resetForm(); }}>
          ⭐ Welcome New Star
        </button>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Search by name, parent name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => { setShowForm(false); setEditingChild(null); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingChild ? 'Edit Child' : 'Add New Child'}</h2>
              <button className="close-btn" onClick={() => { setShowForm(false); setEditingChild(null); resetForm(); }}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="enrollment-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Child's Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Age *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="12"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Parent/Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Parent Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Parent Email *</label>
                <input
                  type="email"
                  required
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Enrollment Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.enrollmentDate}
                    onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Allergies / Medical Notes</label>
                <textarea
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  rows="2"
                  placeholder="List any allergies or important medical information"
                />
              </div>

              <div className="form-group">
                <label>Emergency Contact *</label>
                <input
                  type="text"
                  required
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="Name and phone number"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditingChild(null); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingChild ? 'Update' : 'Add Child'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="children-grid">
        {filteredChildren.map(child => (
          <div key={child.id} className="child-card">
            <div className="child-header">
              <div>
                <h3>{child.name}</h3>
                <span className="child-age">Age: {child.age}</span>
              </div>
              <span className={`status-badge ${child.status || 'active'}`}>{child.status || 'active'}</span>
            </div>
            <div className="child-info">
              <div className="info-item">
                <span className="info-label">Parent:</span>
                <span>{child.parentName || 'N/A'}</span>
              </div>
              {child.parentPhone && (
                <div className="info-item">
                  <span className="info-label">Phone:</span>
                  <span>{child.parentPhone}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span>{child.parentEmail || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Enrolled:</span>
                <span>{child.enrollmentDate ? new Date(child.enrollmentDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              {child.allergies && (
                <div className="info-item">
                  <span className="info-label">Allergies:</span>
                  <span className="allergy-warning">{child.allergies}</span>
                </div>
              )}
              {child.emergencyContact && (
                <div className="info-item">
                  <span className="info-label">Emergency:</span>
                  <span>{child.emergencyContact}</span>
                </div>
              )}
            </div>
            <div className="child-actions">
              <button className="btn-edit" onClick={() => handleEdit(child)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(child)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {filteredChildren.length === 0 && children.length > 0 && (
        <div className="empty-state-large">
          <p>No children match your search criteria.</p>
        </div>
      )}
      {children.length === 0 && (
        <div className="empty-state-large">
          <p>No children enrolled yet. Click "Add Child" to get started.</p>
        </div>
      )}
    </div>
  );
}

