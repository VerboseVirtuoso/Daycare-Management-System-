import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DaycareProvider } from './context/DaycareContext'
import { ToastProvider } from './context/ToastContext'
import Layout from './Layout'
import Dashboard from './Dashboard'
import Enrollment from './Enrollment'
import Activities from './Activities'
import StaffSchedule from './StaffSchedule'
import MealPlanning from './MealPlanning'
import Communications from './Communications'
import './index.css'

function App() {
  return (
    <ToastProvider>
      <DaycareProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/enrollment" element={<Enrollment />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/staff" element={<StaffSchedule />} />
              <Route path="/meals" element={<MealPlanning />} />
              <Route path="/communications" element={<Communications />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </DaycareProvider>
    </ToastProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
