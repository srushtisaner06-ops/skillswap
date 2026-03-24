import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Email + password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Step 1: Verify with Firebase
      await signInWithEmailAndPassword(auth, form.email, form.password);

      // Step 2: Get JWT from YOUR backend
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password
      });

      // Step 3: Save token to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");

    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const response = await axios.post("http://localhost:5000/api/auth/google-register", {
        name: result.user.displayName,
        email: result.user.email,
        firebaseUID: result.user.uid
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: 24 }}>
      <h2>Log in to SkillSwap</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", marginBottom: 16, padding: 8 }}
        />
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Log In
        </button>
      </form>

      <hr style={{ margin: "20px 0" }} />
      <button onClick={handleGoogleLogin} style={{ width: "100%", padding: 10 }}>
        Continue with Google
      </button>

      <p style={{ marginTop: 16, textAlign: "center" }}>
        No account? <a href="/register">Sign up</a>
      </p>
    </div>
  );
}

export default Login;

