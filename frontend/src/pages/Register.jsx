import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Email & Password registration
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      return setError("Passwords do not match!");
    }

    try {
      // Step 1: Create user in Firebase
      const result = await createUserWithEmailAndPassword(auth, form.email, form.password);

      // Step 2: Send email verification
      await sendEmailVerification(result.user);

      // Step 3: Save user details to YOUR database
      await axios.post("http://localhost:5000/api/auth/register", {
        name: form.name,
        email: form.email,
        firebaseUID: result.user.uid
      });

      alert("Verification email sent! Please check your inbox.");
      navigate("/login");

    } catch (err) {
      setError(err.message);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      await axios.post("http://localhost:5000/api/auth/google-register", {
        name: result.user.displayName,
        email: result.user.email,
        firebaseUID: result.user.uid
      });

      navigate("/profile-setup");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: 24 }}>
      <h2>Create your SkillSwap account</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleEmailRegister}>
        <input name="name"     placeholder="Full Name"       value={form.name}     onChange={handleChange} required /><br/><br/>
        <input name="email"    placeholder="Email"    type="email"    value={form.email}    onChange={handleChange} required /><br/><br/>
        <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} required /><br/><br/>
        <input name="confirm"  placeholder="Confirm Password" type="password" value={form.confirm}  onChange={handleChange} required /><br/><br/>
        <button type="submit">Sign Up with Email</button>
      </form>

      <hr/>
      <button onClick={handleGoogleLogin}>Continue with Google</button>
    </div>
  );
}

export default Register;
