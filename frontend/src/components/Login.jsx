import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "./ThemeProvider";
import "../css/Login.css"; 
import Pic2 from "../assets/images/banner1.WEBP";

const Login = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    Username: "",
    Password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/login", credentials);
      alert(res.data.message);

      if (res.data.user) {
        if (res.data.role === "admin") {
          localStorage.setItem("admin", JSON.stringify(res.data.user));
          navigate("/admin/dashboard");
        } else {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/home");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Invalid Username or Password");
      } else {
        console.error("Login failed:", error);
        alert("An error occurred while logging in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`login-page container-fluid p-0 ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <div className="main-content">
        {/* Header Section */}
        <header
          className={`header-section d-flex align-items-center justify-content-center shadow ${
            isDarkMode ? "dark-mode" : "light-mode"
          }`}
          style={{
            backgroundImage: `url(${Pic2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "40vh",
          }}
        >
          <div className="login-header-overlay"></div>

          <div className="overlay-text text-center text-light p-5 position-relative">
            <h1 className="display-4 fw-bold">เข้าสู่ระบบ</h1>
            <p className="lead">
              ยินดีต้อนรับ! โปรดลงชื่อเข้าใช้เพื่อเข้าถึงระบบขนส่งสินค้า
            </p>
          </div>
        </header>

        {/* Login Form Section */}
        <div className="container my-5">
          <div className="card mx-auto shadow login-card login-container">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">ล็อคอิน</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">ชื่อผู้ใช้</label>
                  <input
                    type="text"
                    name="Username"
                    className="form-control"
                    placeholder="Enter your username"
                    value={credentials.Username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">รหัสผ่าน</label>
                  <input
                    type="password"
                    name="Password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={credentials.Password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
