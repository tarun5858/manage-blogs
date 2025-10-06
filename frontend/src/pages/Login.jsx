import { useState } from "react";

import { useAuth } from "../context/AuthContext";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
 const { login } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        alert("Invalid credentials");
        return;
      }

      const data = await res.json();
      login(data.token); // save token
      window.location.href = "/manage-blogs"; // redirect
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div style={{display:"flex",flexDirection:"column",textAlign:"center",height:"500px",fontFamily:"poppins",justifyContent:"center",alignItems:"center"}}>
      <h2 style={{fontWeight:"700"}}>Login Page</h2>
      <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{border:"1px solid black",padding:"3%",borderRadius:"8px",margin:"1%"}}
      /><br /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{border:"1px solid black",padding:"3%",borderRadius:"8px",margin:"1%"}}

      /><br /><br />
      <button 
        style={{border:"1px solid black",padding:"5%",borderRadius:"8px",margin:"1%"}}
      type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
