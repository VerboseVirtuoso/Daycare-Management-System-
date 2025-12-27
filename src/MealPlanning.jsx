import { useState } from 'react';
import { useDaycare } from './context/DaycareContext';
import { useToast } from './context/ToastContext';
import './MealPlanning.css';

export default function MealPlanning() {
  const { state, addMeal, updateMeal, deleteMeal } = useDaycare();
  const { showToast } = useToast();
  const { meals, children } = state;
  const today = new Date().toLocaleDateString('en-CA');
  const [selectedDate, setSelectedDate] = useState(today);
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString('en-CA'),
    mealType: 'breakfast',
    menu: '',
    allergens: []
  });

  const mealTypes = ['breakfast', 'morning-snack', 'lunch', 'afternoon-snack', 'dinner'];
  const commonAllergens = ['Eggs', 'Milk', 'Peanuts', 'Tree Nuts', 'Soy', 'Wheat', 'Gluten', 'Fish', 'Shellfish'];

  const filteredMeals = meals.filter(m => m.date === selectedDate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMeal) {
        await updateMeal(editingMeal.id, formData);
        showToast('Meal updated successfully', 'success');
        setEditingMeal(null);
      } else {
        await addMeal(formData);
        showToast('Meal added successfully', 'success');
      }
      setShowForm(false);
      resetForm();
    } catch (error) {
      showToast(error.message || 'Failed to save meal', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      date: selectedDate,
      mealType: 'breakfast',
      menu: '',
      allergens: []
    });
  };

  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setFormData(meal);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await deleteMeal(id);
        showToast('Meal deleted successfully', 'success');
      } catch (error) {
        showToast(error.message || 'Failed to delete meal', 'error');
      }
    }
  };

  const toggleAllergen = (allergen) => {
    const allergens = formData.allergens;
    if (allergens.includes(allergen)) {
      setFormData({
        ...formData,
        allergens: allergens.filter(a => a !== allergen)
      });
    } else {
      setFormData({
        ...formData,
        allergens: [...allergens, allergen]
      });
    }
  };

  const getMealLabel = (type) => {
    return type.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getMealsForWeek = () => {
    const weekStart = new Date(selectedDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      week.push(date.toISOString().split('T')[0]);
    }
    return week;
  };

  const weekDates = getMealsForWeek();

  const mapMealTypeToBackend = (type) => {
    const mapping = {
      'breakfast': 'Breakfast',
      'morning-snack': 'Snack',
      'lunch': 'Lunch',
      'afternoon-snack': 'Snack',
      'dinner': 'Dinner'
    };
    return mapping[type] || 'Breakfast';
  };

  return (
    <div className="meal-planning">
      <div className="page-header">
        <div>
          <h1>🍽️ Healthy Meals</h1>
          <p>Plan nutritious and delicious meals for our little stars</p>
        </div>
        <div className="header-actions">
          <div className="date-selector">
            <label>Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
            />
          </div>
          <button className="btn-primary" onClick={() => { setShowForm(true); setEditingMeal(null); resetForm(); }}>
            🍽️ Plan Meal
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => { setShowForm(false); setEditingMeal(null); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingMeal ? 'Edit Meal' : 'Add New Meal'}</h2>
              <button className="close-btn" onClick={() => { setShowForm(false); setEditingMeal(null); resetForm(); }}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="meal-form">
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
                  <label>Meal Type *</label>
                  <select
                    required
                    value={formData.mealType}
                    onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                  >
                    {mealTypes.map(type => (
                      <option key={type} value={type}>{getMealLabel(type)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Menu *</label>
                <textarea
                  required
                  value={formData.menu}
                  onChange={(e) => setFormData({ ...formData, menu: e.target.value })}
                  rows="4"
                  placeholder="Describe the meal items..."
                />
              </div>

              <div className="form-group">
                <label>Allergens Present</label>
                <div className="allergen-selector">
                  {commonAllergens.map(allergen => (
                    <label key={allergen} className="allergen-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.allergens.includes(allergen)}
                        onChange={() => toggleAllergen(allergen)}
                      />
                      <span>{allergen}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditingMeal(null); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingMeal ? 'Update Meal' : 'Add Meal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="meal-planning-content">
        <div className="daily-meals">
          <h2>Meals for {new Date(selectedDate).toLocaleDateString()}</h2>
          {filteredMeals.length > 0 ? (
            <div className="meals-list">
              {mealTypes.map(type => {
                const meal = filteredMeals.find(m => {
                  const mealType = m.mealType?.toLowerCase() || '';
                  return mealType === type || mealType === mapMealTypeToBackend(type).toLowerCase();
                });
                return (
                  <div key={type} className="meal-card">
                    <div className="meal-card-header">
                      <h3>{getMealLabel(type)}</h3>
                      {meal ? (
                        <div className="meal-actions">
                          <button className="btn-edit-small" onClick={() => handleEdit(meal)}>Edit</button>
                          <button className="btn-delete-small" onClick={() => handleDelete(meal._id || meal.id)}>Delete</button>
                        </div>
                      ) : null}
                    </div>
                    {meal ? (
                      <>
                        <div className="meal-menu">{meal.menu}</div>
                        {meal.allergens && meal.allergens.length > 0 && (
                          <div className="meal-allergens">
                            <strong>⚠️ Allergens:</strong> {meal.allergens.join(', ')}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="meal-empty">
                        <p>No meal planned</p>
                        <button
                          className="btn-add-meal"
                          onClick={() => {
                            setFormData({
                              date: selectedDate,
                              mealType: type,
                              menu: '',
                              allergens: []
                            });
                            setShowForm(true);
                          }}
                        >
                          + Add {getMealLabel(type)}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state-large">
              <p>No meals planned for this date. Click "Add Meal" to get started.</p>
            </div>
          )}
        </div>

        <div className="weekly-overview">
          <h2>Weekly Overview</h2>
          <div className="weekly-calendar">
            {weekDates.map(date => {
              const dayMeals = meals.filter(m => m.date === date);
              return (
                <div key={date} className="week-day">
                  <div className="week-day-header">
                    <div className="week-day-name">
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="week-day-date">
                      {new Date(date).getDate()}
                    </div>
                  </div>
                  <div className="week-day-meals">
                    {dayMeals.length > 0 ? (
                      dayMeals.map(meal => (
                        <div key={meal.id || meal._id} className="week-meal-item">
                          <span className="week-meal-type">{getMealLabel(meal.mealType || 'breakfast').substring(0, 1)}</span>
                          <span className="week-meal-menu">{(meal.menu || '').substring(0, 30)}...</span>
                        </div>
                      ))
                    ) : (
                      <div className="week-day-empty">No meals</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
