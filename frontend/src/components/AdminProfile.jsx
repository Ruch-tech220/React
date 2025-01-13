import React, { useState } from "react";
import axios from "axios";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("admin")));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...admin });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:5000/admin/update",
        formData
      );
      alert(res.data.message);
      localStorage.setItem("admin", JSON.stringify(formData)); // อัปเดต Local Storage
      setAdmin(formData); // อัปเดต State
      setIsEditing(false); // ปิดโหมดแก้ไข
    } catch (error) {
      console.error(error);
      alert("Failed to update admin information.");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Admin Profile</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="Emp_Name"
              value={formData.Emp_Name}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="Emp_Lname"
              value={formData.Emp_Lname}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="text"
              name="Emp_Phone"
              value={formData.Emp_Phone}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="Emp_Email"
              value={formData.Emp_Email}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-success">
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="btn btn-secondary ms-2"
          >
            Cancel
          </button>
        </form>
      ) : (
        <ul className="list-group">
          <li className="list-group-item">
            <strong>ID:</strong> {admin.Emp_ID}
          </li>
          <li className="list-group-item">
            <strong>Name:</strong> {admin.Emp_Name} {admin.Emp_Lname}
          </li>
          <li className="list-group-item">
            <strong>Username:</strong> {admin.Username}
          </li>
          <li className="list-group-item">
            <strong>Password:</strong> {admin.Password}
          </li>
          <li className="list-group-item">
            <strong>Phone:</strong> {admin.Emp_Phone}
          </li>
          <li className="list-group-item">
            <strong>Email:</strong> {admin.Emp_Email}
          </li>
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary mt-3"
          >
            Edit
          </button>
        </ul>
      )}
    </div>
  );
};

export default AdminProfile;
