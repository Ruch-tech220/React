import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ThemeContext } from "./ThemeProvider";
import logo from "../assets/images/logo1.WEBP";
import "../css/Navbar.css"; 

const Navbar = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <nav
      className={`navbar navbar-expand-lg shadow-sm main-navbar ${
        isDarkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
      }`}
    >
      <div className="container">
        <Link to="/home" className="navbar-brand d-flex align-items-center">
          <img
            src={logo}
            alt="Logo"
            className="me-2 rounded-circle"
            style={{ width: "50px", height: "50px" }}
          />
          <span className="fw-bold">ระบบขนส่งสินค้า</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* เมนูหลัก */}
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <NavLink to="/home" className="nav-link">
                หน้าแรก
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/services" className="nav-link">
                บริการ
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className="nav-link">
                เกี่ยวกับเรา
              </NavLink>
            </li>

            {/* ยังไม่ล็อกอิน */}
            {!user.Cus_Name && !admin.Emp_Name ? (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    เข้าสู่ระบบ
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    สมัครสมาชิก
                  </NavLink>
                </li>
              </>
            ) : admin.Emp_Name ? (
              // Admin
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  id="navbarDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {admin.Emp_Name}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/admin/profile" className="dropdown-item">
                      โปรไฟล์
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/dashboard" className="dropdown-item">
                      แดชบอร์ด
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      ออกจากระบบ
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              // User
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  id="navbarDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user.Cus_Name}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/profile" className="dropdown-item">
                      โปรไฟล์
                    </Link>
                  </li>
                  <li>
                    <Link to="/order-history" className="dropdown-item">
                      ประวัติการสั่งซื้อ
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      ออกจากระบบ
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          {/* ปุ่มโหมดสว่าง/มืด */}
          <div className="d-flex">
            <button
              className={`btn btn-sm ms-3 ${
                isDarkMode ? "btn-light" : "btn-dark"
              } toggle-theme-btn`}
              onClick={toggleTheme}
            >
              {isDarkMode ? (
                <>
                  <i className="bi bi-sun-fill text-warning me-1"></i>
                  Light
                </>
              ) : (
                <>
                  <i className="bi bi-moon-fill text-white me-1"></i>
                  Dark
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

