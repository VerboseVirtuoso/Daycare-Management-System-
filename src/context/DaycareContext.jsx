import React, { createContext, useContext, useReducer, useEffect } from "react";

const DaycareContext = createContext();

const initialState = {
  children: [],
  activities: [],
  meals: [],
  staff: [],
  communications: []
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CHILDREN":
      return { ...state, children: action.payload };

    case "SET_ACTIVITIES":
      return { ...state, activities: action.payload };

    case "SET_MEALS":
      return { ...state, meals: action.payload };

    case "SET_STAFF":
      return { ...state, staff: action.payload };

    case "SET_COMMUNICATIONS":
      return { ...state, communications: action.payload };

    default:
      return state;
  }
}

export const DaycareProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  /* ---------------- CHILDREN ---------------- */

  const fetchChildren = async () => {
    const res = await fetch("http://localhost:3000/api/children");
    const data = await res.json();
    dispatch({
      type: "SET_CHILDREN",
      payload: data.children.map(c => ({
        ...c,
        id: c._id,
        status: c.status || "active"
      }))
    });
  };

  const addChild = async (childData) => {
    await fetch("http://localhost:3000/api/children/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(childData)
    });
    fetchChildren();
  };

  const updateChild = async (id, childData) => {
    await fetch(`http://localhost:3000/api/children/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(childData)
    });
    fetchChildren();
  };

  const deleteChild = async (id) => {
    await fetch(`http://localhost:3000/api/children/${id}`, {
      method: "DELETE"
    });
    fetchChildren();
  };

  /* ---------------- ACTIVITIES ---------------- */

  const fetchActivities = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/activities/all");
      const data = await res.json();
      if (data.success) {
        dispatch({
          type: "SET_ACTIVITIES",
          payload: data.data.map(a => ({
            ...a,
            id: a._id,
            date: new Date(a.date).toISOString().split('T')[0]
          }))
        });
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    }
  };

  const addActivity = async (activityData) => {
    await fetch("http://localhost:3000/api/activities/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activityData)
    });
    fetchActivities();
  };

  const updateActivity = async (id, activityData) => {
    await fetch(`http://localhost:3000/api/activities/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activityData)
    });
    fetchActivities();
  };

  const deleteActivity = async (id) => {
    await fetch(`http://localhost:3000/api/activities/${id}`, {
      method: "DELETE"
    });
    fetchActivities();
  };

  /* ---------------- MEALS ---------------- */

  const fetchMeals = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/meals/all");
      const data = await res.json();
      if (data.success) {
        dispatch({
          type: "SET_MEALS",
          payload: data.data.map(m => ({
            ...m,
            id: m._id,
            date: new Date(m.date).toISOString().split('T')[0]
          }))
        });
      }
    } catch (error) {
      console.error("Failed to fetch meals:", error);
    }
  };

  const addMeal = async (mealData) => {
    await fetch("http://localhost:3000/api/meals/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mealData)
    });
    fetchMeals();
  };

  const updateMeal = async (id, mealData) => {
    await fetch(`http://localhost:3000/api/meals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mealData)
    });
    fetchMeals();
  };

  const deleteMeal = async (id) => {
    await fetch(`http://localhost:3000/api/meals/${id}`, {
      method: "DELETE"
    });
    fetchMeals();
  };

  const addStaff = async (staffData) => {
    await fetch("http://localhost:3000/api/staff/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staffData)
    });
    fetchStaff();
  };

  const updateStaff = async (id, staffData) => {
    await fetch(`http://localhost:3000/api/staff/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staffData)
    });
    fetchStaff();
  };

  const deleteStaff = async (id) => {
    await fetch(`http://localhost:3000/api/staff/${id}`, {
      method: "DELETE"
    });
    fetchStaff();
  };

  /* ---------------- COMMUNICATIONS ---------------- */

  const fetchCommunications = async () => {
    const res = await fetch("http://localhost:3000/api/announcements");
    const data = await res.json();
    dispatch({ type: "SET_COMMUNICATIONS", payload: data || [] });
  };

  const addAnnouncement = async (announcementData) => {
    await fetch("http://localhost:3000/api/announcements/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(announcementData)
    });
    fetchCommunications();
  };

  /* ---------------- STAFF ---------------- */

  const fetchStaff = async () => {
    const res = await fetch("http://localhost:3000/api/staff");
    const data = await res.json();
    dispatch({
      type: "SET_STAFF",
      payload: (data.staff || []).map(s => ({ ...s, id: s._id }))
    });
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    fetchChildren();
    fetchStaff();
    fetchCommunications();
  }, []);

  useEffect(() => {
    if (state.children.length > 0) {
      fetchActivities();
      fetchMeals();
    }
  }, [state.children.length]);

  return (
    <DaycareContext.Provider
      value={{
        state,
        addChild,
        updateChild,
        deleteChild,
        addActivity,
        updateActivity,
        deleteActivity,
        addMeal,
        updateMeal,
        deleteMeal,
        addStaff,
        updateStaff,
        deleteStaff,
        addAnnouncement,
        fetchChildren,
        fetchActivities,
        fetchMeals,
        fetchStaff,
        fetchCommunications
      }}
    >
      {children}
    </DaycareContext.Provider>
  );
};

export const useDaycare = () => {
  return useContext(DaycareContext);
};



