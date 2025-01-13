import React, { useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:5000/user/update",
        formData
      );
      alert(res.data.message);
      localStorage.setItem("user", JSON.stringify(formData)); // อัปเดต Local Storage
      setUser(formData); // อัปเดต State
      setIsEditing(false); // ปิดโหมดแก้ไข
    } catch (error) {
      console.error(error);
      alert("Failed to update user information.");
    }
  };

  return (
    <div className="container mt-5">
      <h1>User Profile</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="Cus_Name"
              value={formData.Cus_Name}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="Cus_Lname"
              value={formData.Cus_Lname}
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
              name="Cus_Phone"
              value={formData.Cus_Phone}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="Cus_Email"
              value={formData.Cus_Email}
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
            <strong>ID:</strong> {user.Cus_ID}
          </li>
          <li className="list-group-item">
            <strong>Name:</strong> {user.Cus_Name} {user.Cus_Lname}
          </li>
          <li className="list-group-item">
            <strong>Username:</strong> {user.Username}
          </li>
          <li className="list-group-item">
            <strong>Password:</strong> {user.Password}
          </li>
          <li className="list-group-item">
            <strong>Phone:</strong> {user.Cus_Phone}
          </li>
          <li className="list-group-item">
            <strong>Email:</strong> {user.Cus_Email}
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

export default Profile;
