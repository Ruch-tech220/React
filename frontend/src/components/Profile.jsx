import React, { useState, useContext } from "react";
import axios from "axios";
import "../css/Profile.css";
import { ThemeContext } from "./ThemeProvider";

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
      localStorage.setItem("user", JSON.stringify(formData));
      setUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองใหม่");
    }
  };

  return (
    <div className={`profile-page container-fluid py-5 ${isDarkMode ? "bg-dark text-light" : "bg-light"}`}>
      <div className="container">
        <div className={`profile-card mx-auto p-4 rounded-4 shadow-lg ${isDarkMode ? "bg-dark-gray" : "bg-white"}`}>
          <div className="text-center mb-4">
            <div className="avatar-wrapper mx-auto mb-3 ">
              <i className="bi bi-person-circle display-3 text-info"></i>
            </div>
            <h2 className="h3 fw-bold mb-0">ข้อมูลผู้ใช้งาน</h2>
            <div className="">ID: {user.Cus_ID}</div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      name="Cus_Name"
                      value={formData.Cus_Name}
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
                      name="Cus_Lname"
                      value={formData.Cus_Lname}
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
                      type="tel"
                      name="Cus_Phone"
                      value={formData.Cus_Phone}
                      onChange={handleChange}
                      className="form-control form-control-lg"
                      placeholder="เบอร์โทร"
                      required
                    />
                    <label>เบอร์โทร</label>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-floating">
                    <input
                      type="email"
                      name="Cus_Email"
                      value={formData.Cus_Email}
                      onChange={handleChange}
                      className="form-control form-control-lg"
                      placeholder="อีเมล"
                      required
                    />
                    <label>อีเมล</label>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-center">
                <button
                  type="submit"
                  className="btn btn-success btn-lg px-5 py-3 fw-bold"
                >
                  <i className="bi bi-check2-circle me-2"></i>บันทึกการเปลี่ยนแปลง
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-outline-secondary btn-lg px-5 py-3"
                >
                  <i className="bi bi-x-circle me-2"></i>ยกเลิก
                </button>
              </div>
            </form>
          ) : (
            <div className="user-info">
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="info-item p-3 rounded-3 bg-light-hover">
                    <div className=" small mb-1">ชื่อ-สกุล</div>
                    <div className="h5 fw-bold">
                      {user.Cus_Name} {user.Cus_Lname}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="info-item p-3 rounded-3 bg-light-hover">
                    <div className=" small mb-1">ชื่อผู้ใช้</div>
                    <div className="h5 fw-bold">{user.Username}</div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="info-item p-3 rounded-3 bg-light-hover">
                    <div className=" small mb-1">เบอร์โทรศัพท์</div>
                    <div className="h5 fw-bold">
                      <a href={`tel:${user.Cus_Phone}`} className="text-decoration-none">
                        {user.Cus_Phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="info-item p-3 rounded-3 bg-light-hover">
                    <div className=" small mb-1">อีเมล</div>
                    <div className="h5 fw-bold">
                      <a href={`mailto:${user.Cus_Email}`} className="text-decoration-none">
                        {user.Cus_Email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-success btn-lg px-5 py-3 fw-bold"
                >
                  <i className="bi bi-pencil-square me-2"></i>แก้ไขข้อมูลส่วนตัว
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