// Save login info after login
export function saveAuth(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

// Get the current user from storage
export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// Get the token (used when making API requests)
export function getToken() {
  return localStorage.getItem("token");
}

// Check if user is logged in
export function isLoggedIn() {
  return !!localStorage.getItem("token");
}

// Log out - clear everything and redirect
export function logout(navigate) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
}