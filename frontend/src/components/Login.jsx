import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    Username: "",
    Password: "",
  });
  const [loading, setLoading] = useState(false); // เพิ่มสถานะ Loading
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // เริ่ม Loading

    try {
      const res = await axios.post("http://localhost:5000/login", credentials);

      alert(res.data.message);

      if (res.data.user) {
        // เก็บข้อมูลผู้ใช้ใน Local Storage
        if (res.data.role === "admin") {
          localStorage.setItem("admin", JSON.stringify(res.data.user));
        } else {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        // เปลี่ยนหน้าไปยัง Home หรือ Admin Dashboard
        navigate(res.data.role === "admin" ? "/admin/dashboard" : "/home");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Invalid Username or Password");
      } else {
        console.error("Login failed:", error);
        alert("An error occurred while logging in.");
      }
    } finally {
      setLoading(false); // หยุด Loading
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Login</h2>
      <form
        onSubmit={handleSubmit}
        className="mt-4 mx-auto"
        style={{ maxWidth: "400px" }}
      >
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            name="Username"
            className="form-control"
            placeholder="Enter your username"
            value={credentials.Username}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="Password"
            className="form-control"
            placeholder="Enter your password"
            value={credentials.Password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
