import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.Cus_Name) newErrors.Cus_Name = "First name is required.";
    if (!formData.Cus_Lname) newErrors.Cus_Lname = "Last name is required.";
    if (!formData.Username) newErrors.Username = "Username is required.";
    if (!formData.Password || formData.Password.length < 6)
      newErrors.Password = "Password must be at least 6 characters.";
    if (!formData.Cus_Phone) newErrors.Cus_Phone = "Phone number is required.";
    if (!formData.Cus_Email || !/\S+@\S+\.\S+/.test(formData.Cus_Email))
      newErrors.Cus_Email = "Valid email is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      // สมัครสมาชิก
      const registerRes = await axios.post(
        "http://localhost:5000/register",
        formData
      );
      alert(registerRes.data.message);

      // เข้าสู่ระบบอัตโนมัติหลังสมัคร
      const loginRes = await axios.post("http://localhost:5000/login", {
        Username: formData.Username,
        Password: formData.Password,
      });

      // บันทึกข้อมูลผู้ใช้ใน localStorage
      if (loginRes.data.role === "user") {
        localStorage.setItem("user", JSON.stringify(loginRes.data.user));
      } else {
        localStorage.setItem("admin", JSON.stringify(loginRes.data.user));
      }

      // เปลี่ยนหน้าไปยัง Home หรือ Admin Dashboard
      navigate(loginRes.data.role === "admin" ? "/admin/dashboard" : "/home");
    } catch (error) {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        console.error(error);
        alert("An error occurred!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow mx-auto" style={{ maxWidth: "500px" }}>
        <div className="card-header bg-success text-white text-center">
          <h2>Register</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="Cus_Name"
                className={`form-control ${
                  errors.Cus_Name ? "is-invalid" : ""
                }`}
                placeholder="Enter your first name"
                value={formData.Cus_Name}
                onChange={handleChange}
              />
              {errors.Cus_Name && (
                <div className="invalid-feedback">{errors.Cus_Name}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="Cus_Lname"
                className={`form-control ${
                  errors.Cus_Lname ? "is-invalid" : ""
                }`}
                placeholder="Enter your last name"
                value={formData.Cus_Lname}
                onChange={handleChange}
              />
              {errors.Cus_Lname && (
                <div className="invalid-feedback">{errors.Cus_Lname}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="Username"
                className={`form-control ${
                  errors.Username ? "is-invalid" : ""
                }`}
                placeholder="Enter your username"
                value={formData.Username}
                onChange={handleChange}
              />
              {errors.Username && (
                <div className="invalid-feedback">{errors.Username}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="Password"
                className={`form-control ${
                  errors.Password ? "is-invalid" : ""
                }`}
                placeholder="Enter your password"
                value={formData.Password}
                onChange={handleChange}
              />
              {errors.Password && (
                <div className="invalid-feedback">{errors.Password}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                name="Cus_Phone"
                className={`form-control ${
                  errors.Cus_Phone ? "is-invalid" : ""
                }`}
                placeholder="Enter your phone number"
                value={formData.Cus_Phone}
                onChange={handleChange}
              />
              {errors.Cus_Phone && (
                <div className="invalid-feedback">{errors.Cus_Phone}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="Cus_Email"
                className={`form-control ${
                  errors.Cus_Email ? "is-invalid" : ""
                }`}
                placeholder="Enter your email"
                value={formData.Cus_Email}
                onChange={handleChange}
              />
              {errors.Cus_Email && (
                <div className="invalid-feedback">{errors.Cus_Email}</div>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
