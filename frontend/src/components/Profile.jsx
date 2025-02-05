import React, { useState, useContext } from "react";
import axios from "axios";
import "../css/Profile.css";
import { ThemeContext } from "./ThemeProvider"; // ใช้ ThemeContext

const Profile = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:5000/user/update", formData);
      alert("ข้อมูลได้รับการอัปเดตสำเร็จ!");
      localStorage.setItem("user", JSON.stringify(formData)); // อัปเดต Local Storage
      setUser(formData); // อัปเดต State
      setIsEditing(false); // ปิดโหมดแก้ไข
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองใหม่");
    }
  };

  return (
    <div
      className={`profile-page container-fluid py-5 ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <div className="container">
        <div className="profile-card mx-auto p-4 rounded shadow">
          <h2 className="text-center mb-4">
            <i className="bi bi-person-circle me-2"></i>ข้อมูลผู้ใช้งาน
          </h2>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">ชื่อ</label>
                  <input
                    type="text"
                    name="Cus_Name"
                    value={formData.Cus_Name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">นามสกุล</label>
                  <input
                    type="text"
                    name="Cus_Lname"
                    value={formData.Cus_Lname}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">ชื่อผู้ใช้</label>
                  <input
                    type="text"
                    name="Username"
                    value={formData.Username}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">รหัสผ่าน</label>
                  <input
                    type="password"
                    name="Password"
                    value={formData.Password}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">เบอร์โทร</label>
                  <input
                    type="text"
                    name="Cus_Phone"
                    value={formData.Cus_Phone}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">อีเมล</label>
                  <input
                    type="email"
                    name="Cus_Email"
                    value={formData.Cus_Email}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-success me-2">
                  <i className="bi bi-check2-circle me-1"></i>บันทึก
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                >
                  <i className="bi bi-x-circle me-1"></i>ยกเลิก
                </button>
              </div>
            </form>
          ) : (
            <div className="info-list">
              <div className="row mb-3">
                <div className="col-md-6">
                  <p>
                    <strong>ID:</strong> {user.Cus_ID}
                  </p>
                  <p>
                    <strong>ชื่อ:</strong> {user.Cus_Name} {user.Cus_Lname}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>ชื่อผู้ใช้:</strong> {user.Username}
                  </p>
                  <p>
                    <strong>รหัสผ่าน:</strong> {user.Password}
                  </p>
                </div>
              </div>
              <p>
                <strong>เบอร์โทร:</strong> {user.Cus_Phone}
              </p>
              <p>
                <strong>อีเมล:</strong> {user.Cus_Email}
              </p>
              <div className="text-center mt-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  <i className="bi bi-pencil-square me-1"></i>แก้ไขข้อมูล
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
