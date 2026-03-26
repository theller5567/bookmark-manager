import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Archived from './pages/Archived'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import ResetPassword from './pages/ResetPassword'
import Signin from './pages/Signin'
import Signup from './pages/Signup'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/archived" element={<Archived />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
