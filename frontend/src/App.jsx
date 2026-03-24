import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";     
import ProfileSetup from "./pages/ProfileSetup";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages — anyone can visit */}
        <Route path="/register" element={<Register />} />
        <Route path="/login"    element={<Login />} />

        {/* Protected pages — only logged-in users */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile-setup" element={
          <ProtectedRoute>
            <ProfileSetup />
          </ProtectedRoute>
        } />

        {/* Default: go to login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;