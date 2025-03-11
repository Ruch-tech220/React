import React, { useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "./ThemeProvider"; // import สำหรับ Dark/Light Mode
import "../css/Register.css"; // import ไฟล์ CSS
import Pic2 from "../assets/images/banner1.WEBP"; // รูปพื้นหลัง Header (เหมือน login เพื่อให้ดีไซน์สอดคล้อง)
import { useNavigate } from "react-router-dom"; // import useNavigate

// ตัวอย่างโค้ด Register
const Register = () => {
  const navigate = useNavigate(); // สร้างตัวแปร navigate
  const { isDarkMode } = useContext(ThemeContext);

  // State สำหรับฟอร์ม, error, และสถานะ loading
  const [formData, setFormData] = useState({
    Cus_Name: "",
    Cus_Lname: "",
    Username: "",
    Password: "",
    Cus_Phone: "",
    Cus_Email: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันจัดการ Input
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Cus_Phone") {
      // ลบทุกตัวอักษรที่ไม่ใช่ตัวเลข
      let newValue = value.replace(/\D/g, "");

      // จำกัดความยาวไม่เกิน 10 ตัว
      if (newValue.length > 10) {
        newValue = newValue.slice(0, 10);
        setErrors({ ...errors, Cus_Phone: "เบอร์โทรต้องไม่เกิน 10 ตัวเลข" });
      } else {
        setErrors({ ...errors, Cus_Phone: "" });
      }

      // อัพเดทค่าใน state
      setFormData({ ...formData, [name]: newValue });

      // ตรวจสอบความยาวและแสดงข้อความเตือน
      if (newValue.length > 0 && newValue.length < 10) {
        setErrors({ ...errors, Cus_Phone: `กรุณากรอกให้ครบ 10 หลัก (เหลืออีก ${10 - newValue.length} หลัก)` });
      } else if (newValue.length === 10) {
        setErrors({ ...errors, Cus_Phone: "" });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };


  // ฟังก์ชัน Submit ฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ตัวอย่างตรวจสอบความถูกต้องเบื้องต้น (Client Side)
    let newErrors = {};
    if (!formData.Cus_Name) newErrors.Cus_Name = "กรุณากรอกชื่อ";
    if (!formData.Cus_Lname) newErrors.Cus_Lname = "กรุณากรอกนามสกุล";
    if (!formData.Username) newErrors.Username = "กรุณากรอกชื่อผู้ใช้";
    if (!formData.Password) newErrors.Password = "กรุณากรอกรหัสผ่าน";
    if (!formData.Cus_Phone) newErrors.Cus_Phone = "กรุณากรอกเบอร์โทร";
    if (!formData.Cus_Email) newErrors.Cus_Email = "กรุณากรอกอีเมล";

    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(formData.Cus_Phone)) {
      newErrors.Cus_Phone = "เบอร์โทรต้องเป็นตัวเลขเท่านั้น";
    }

    // ตรวจสอบความยาวของเบอร์โทร
    if (formData.Cus_Phone.length !== 10) {
      newErrors.Cus_Phone = "กรุณากรอกเบอร์โทรให้ครบ 10 หลัก";
    }

    // ตรวจสอบรหัสผ่านให้มีความยาวอย่างน้อย 6 ตัว
    if (formData.Password.length < 6) {
      newErrors.Password = "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัว";
    }

    // ตรวจสอบรหัสผ่านให้เป็นภาษาอังกฤษ
    const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+]*$/;
    if (!passwordRegex.test(formData.Password)) {
      newErrors.Password = "รหัสผ่านต้องเป็นภาษาอังกฤษเท่านั้น สามารถใส่ตัวเลขหรือเครื่องหมายได้";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      // เรียกใช้งาน API ของคุณเพื่อสมัครสมาชิก
      const res = await axios.post("http://localhost:5000/register", formData);
      alert(res.data.message || "สมัครสมาชิกสำเร็จ!");

      // Reset ฟอร์ม หรือทำ Redirect ตามต้องการ
      setFormData({
        Cus_Name: "",
        Cus_Lname: "",
        Username: "",
        Password: "",
        Cus_Phone: "",
        Cus_Email: "",
      });
      navigate("/login"); // เปลี่ยนเส้นทางไปยังหน้า login

    } catch (error) {
      console.error("Registration error:", error.response?.data);

      // รับข้อผิดพลาดจาก backend
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;

        // แปลงรูปแบบข้อผิดพลาดให้ตรงกับ state
        const newErrors = {
          Cus_Email: serverErrors.email,
          Username: serverErrors.username,
          Cus_Phone: serverErrors.phone
        };

        setErrors(newErrors);
        return;
      }

      alert(error.response?.data?.error || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`register-page container-fluid p-0 ${isDarkMode ? "dark-mode" : "light-mode"
        }`}
    >
      {/* Main Section */}
      <div className="main-content">
        <header
          className={`header-section d-flex align-items-center justify-content-center shadow ${isDarkMode ? "dark-mode" : "light-mode"
            }`}
          style={{
            backgroundImage: `url(${Pic2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "40vh",
          }}
        >
          {/* ชั้นสีทับบนรูปภาพ เพื่อให้อ่านตัวหนังสือง่ายขึ้น */}
          <div className="register-header-overlay"></div>

          <div className="overlay-text text-center text-light p-5 position-relative">
            <h1 className="display-4 fw-bold mb-3">สมัครสมาชิก</h1>
            <p className="lead">
              เข้าร่วมกับเราวันนี้เพื่อเข้าถึงบริการขนส่งของเรา
            </p>
          </div>
        </header>

        {/* Register Form Section */}
        <div className="container my-5">
          <div className="card mx-auto shadow register-container">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">สมัครสมาชิก</h2>

              <form onSubmit={handleSubmit}>
                {/* ชื่อ */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">ชื่อ</label>
                  <input
                    type="text"
                    name="Cus_Name"
                    className={`form-control ${errors.Cus_Name ? "is-invalid" : ""
                      }`}
                    placeholder="กรอกชื่อ"
                    value={formData.Cus_Name}
                    onChange={handleChange}
                  />
                  {errors.Cus_Name && (
                    <div className="invalid-feedback">{errors.Cus_Name}</div>
                  )}
                </div>

                {/* นามสกุล */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">นามสกุล</label>
                  <input
                    type="text"
                    name="Cus_Lname"
                    className={`form-control ${errors.Cus_Lname ? "is-invalid" : ""
                      }`}
                    placeholder="กรอกนามสกุล"
                    value={formData.Cus_Lname}
                    onChange={handleChange}
                  />
                  {errors.Cus_Lname && (
                    <div className="invalid-feedback">{errors.Cus_Lname}</div>
                  )}
                </div>

                {/* ชื่อผู้ใช้ */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">ชื่อผู้ใช้</label>
                  <input
                    type="text"
                    name="Username"
                    className={`form-control ${errors.Username ? "is-invalid" : ""
                      }`}
                    placeholder="กรอกชื่อผู้ใช้"
                    value={formData.Username}
                    onChange={handleChange}
                  />
                  {errors.Username && (
                    <div className="invalid-feedback">{errors.Username}</div>
                  )}
                </div>

                {/* รหัสผ่าน */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">รหัสผ่าน</label>
                  <input
                    type="password"
                    name="Password"
                    className={`form-control ${errors.Password ? "is-invalid" : ""
                      }`}
                    placeholder="กรอกรหัสผ่าน"
                    value={formData.Password}
                    onChange={handleChange}
                  />
                  {errors.Password && (
                    <div className="invalid-feedback">{errors.Password}</div>
                  )}
                </div>

                {/* เบอร์โทร */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">เบอร์โทร</label>
                  <input
                    type="tel"
                    name="Cus_Phone"
                    className={`form-control ${errors.Cus_Phone ? "is-invalid" : ""}`}
                    placeholder="กรอกเบอร์โทร "
                    value={formData.Cus_Phone}
                    onChange={handleChange}
                    maxLength="10"
                    inputMode="numeric"
                  />
                  {errors.Cus_Phone && (
                    <div className="invalid-feedback d-block">
                      {errors.Cus_Phone}
                      {formData.Cus_Phone.length === 10 && (
                        <span className="text-success ms-2">
                          <i className="bi bi-check-circle-fill"></i> หมายเลขถูกต้อง
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* อีเมล */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">อีเมล</label>
                  <input
                    type="email"
                    name="Cus_Email"
                    className={`form-control ${errors.Cus_Email ? "is-invalid" : ""
                      }`}
                    placeholder="กรอกอีเมล"
                    value={formData.Cus_Email}
                    onChange={handleChange}
                  />
                  {errors.Cus_Email && (
                    <div className="invalid-feedback">{errors.Cus_Email}</div>
                  )}
                </div>

                {/* ปุ่มสมัครสมาชิก */}
                <button
                  type="submit"
                  className="btn btn-info w-100"
                  disabled={loading}
                >
                  {loading ? "กำลังลงทะเบียน..." : "สมัครสมาชิก"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
