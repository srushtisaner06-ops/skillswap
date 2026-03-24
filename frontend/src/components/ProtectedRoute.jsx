import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

function ProtectedRoute({ children }) {
  // If not logged in, redirect to login page
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, show the actual page
  return children;
}

export default ProtectedRoute;