import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://dynamic-blog-server-g5ea.onrender.com/api/login", {
      // const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      
// const text = await res.text(); // get raw text

console.log("Status:", res.status);
      const data = await res.json();
console.log("Response text:", data);

      if (res.ok && data.success) {
        // Save token in context
        login(data.token);

        // Redirect to /manage-blogs
        navigate("/manage-blogs");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", textAlign: "center", height: "500px", fontFamily: "poppins", justifyContent: "center", alignItems: "center" }}>
      <h2 style={{ fontWeight: "700" }}>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ border: "1px solid black", padding: "3%", borderRadius: "8px", margin: "1%" }}
        /><br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ border: "1px solid black", padding: "3%", borderRadius: "8px", margin: "1%" }}
        /><br /><br />
        <button
          style={{ border: "1px solid black", padding: "5%", borderRadius: "8px", margin: "1%" }}
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
