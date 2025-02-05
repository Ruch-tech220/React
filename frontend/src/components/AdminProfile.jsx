import React, { useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "./ThemeProvider"; 
import "../css/AdminProfile.css"; 

const AdminProfile = () => {
  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("admin")));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...admin });
  const { isDarkMode } = useContext(ThemeContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:5000/admin/update", formData);
      alert(res.data.message);
      localStorage.setItem("admin", JSON.stringify(formData));
      setAdmin(formData);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update admin information.");
    }
  };

  return (
    <div
      className={`admin-profile container py-5 ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <h1 className="mb-4 text-center">
        <i className="bi bi-person-circle me-2"></i>โปรไฟล์แอดมิน
      </h1>

      <div className="profile-card card shadow-sm mx-auto">
        <div className="card-body">
          {/* ถ้าอยู่ในโหมดแก้ไข */}
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">ชื่อ</label>
                <input
                  type="text"
                  name="Emp_Name"
                  value={formData.Emp_Name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">นามสกุล</label>
                <input
                  type="text"
                  name="Emp_Lname"
                  value={formData.Emp_Lname}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">ชื่อผู้ใช้</label>
                <input
                  type="text"
                  name="Username"
                  value={formData.Username}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">รหัสผ่าน</label>
                <input
                  type="password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">เบอร์โทร</label>
                <input
                  type="text"
                  name="Emp_Phone"
                  value={formData.Emp_Phone}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">อีเมล</label>
                <input
                  type="email"
                  name="Emp_Email"
                  value={formData.Emp_Email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-success me-2">
                  <i className="bi bi-check-circle me-1"></i>บันทึก
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          ) : (
            // ถ้าอยู่ในโหมดแสดงผล
            <>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>ID:</strong> {admin.Emp_ID}
                </li>
                <li className="list-group-item">
                  <strong>ชื่อ:</strong> {admin.Emp_Name} {admin.Emp_Lname}
                </li>
                <li className="list-group-item">
                  <strong>ชื่อผู้ใช้:</strong> {admin.Username}
                </li>
                <li className="list-group-item">
                  <strong>รหัสผ่าน:</strong> {admin.Password}
                </li>
                <li className="list-group-item">
                  <strong>เบอร์โทร:</strong> {admin.Emp_Phone}
                </li>
                <li className="list-group-item">
                  <strong>อีเมล:</strong> {admin.Emp_Email}
                </li>
              </ul>
              <div className="mt-3 text-end">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  <i className="bi bi-pencil-square me-1"></i>แก้ไข
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
