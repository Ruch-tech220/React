import React, { useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "./ThemeProvider";
import "../css/AdminProfile.css";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("admin")));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...admin });
  const [showPassword, setShowPassword] = useState(false);
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
    <div className={`admin-profile container-fluid py-5 ${isDarkMode ? "bg-dark text-light" : "bg-light"}`}>
      <div className="container">
        <div className="text-center mb-5">
          <div className="avatar-wrapper mx-auto mb-3">
            <i className="bi bi-person-badge display-3 text-primary"></i>
          </div>
          <h1 className="h2 fw-bold mb-2">โปรไฟล์แอดมิน</h1>
          <div className="">ID: {admin.Emp_ID}</div>
        </div>

        <div className={`profile-card card rounded-4 shadow-lg mx-auto ${isDarkMode ? "bg-dark-gray" : "bg-white"}`}>
          <div className="card-body p-4">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="edit-form">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="Emp_Name"
                        value={formData.Emp_Name}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        placeholder="ชื่อ"
                        required
                      />
                      <label>ชื่อ</label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="Emp_Lname"
                        value={formData.Emp_Lname}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        placeholder="นามสกุล"
                        required
                      />
                      <label>นามสกุล</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="Username"
                        value={formData.Username}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        placeholder="ชื่อผู้ใช้"
                        required
                      />
                      <label>ชื่อผู้ใช้</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="Password"
                        value={formData.Password}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        placeholder="รหัสผ่าน"
                        required
                      />
                      <label>รหัสผ่าน</label>
                      <button
                        type="button"
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="tel"
                        name="Emp_Phone"
                        value={formData.Emp_Phone}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        placeholder="เบอร์โทร"
                        required
                      />
                      <label>เบอร์โทร</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="email"
                        name="Emp_Email"
                        value={formData.Emp_Email}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        placeholder="อีเมล"
                        required
                      />
                      <label>อีเมล</label>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-3 justify-content-end mt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-outline-secondary btn-lg px-5"
                  >
                    <i className="bi bi-x-circle me-2"></i>ยกเลิก
                  </button>
                  <button type="submit" className="btn btn-success btn-lg px-5">
                    <i className="bi bi-check-circle me-2"></i>บันทึก
                  </button>
                </div>
              </form>
            ) : (
              <div className="user-info">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="info-item p-3 rounded-3 bg-light-hover">
                      <div className="small mb-1">ชื่อ-สกุล</div>
                      <div className="h5 fw-bold">
                        {admin.Emp_Name} {admin.Emp_Lname}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="info-item p-3 rounded-3 bg-light-hover">
                      <div className=" small mb-1">ชื่อผู้ใช้</div>
                      <div className="h5 fw-bold">{admin.Username}</div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="info-item p-3 rounded-3 bg-light-hover">
                      <div className=" small mb-1">รหัสผ่าน</div>
                      <div className="h5 fw-bold">••••••••</div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="info-item p-3 rounded-3 bg-light-hover">
                      <div className=" small mb-1">เบอร์โทร</div>
                      <div className="h5 fw-bold">
                        <a href={`tel:${admin.Emp_Phone}`} className="text-decoration-none">
                          {admin.Emp_Phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="info-item p-3 rounded-3 bg-light-hover">
                      <div className=" small mb-1">อีเมล</div>
                      <div className="h5 fw-bold">
                        <a href={`mailto:${admin.Emp_Email}`} className="text-decoration-none">
                          {admin.Emp_Email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-end mt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary btn-lg px-5"
                  >
                    <i className="bi bi-pencil-square me-2"></i>แก้ไขโปรไฟล์
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;