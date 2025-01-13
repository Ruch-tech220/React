import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    phone: "",
    email: "",
    role: "user",
  });

  useEffect(() => {
    if (activeTab === "manage") {
      fetchUsers();
    } else if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "dashboard") {
      fetchStats();
    }
  }, [activeTab]);

  // ดึงข้อมูลสถิติ
  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // ดึงข้อมูลผู้ใช้งาน
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // ดึงข้อมูลคำสั่งซื้อ
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/orders");
      setOrders(res.data);
      setLoading(false);
      setFilteredOrders(res.data); // กำหนดค่าเริ่มต้น
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  // จัดการเปลี่ยน Role
  const [loadingChangeRole, setLoadingChangeRole] = useState(false);

  const handleChangeRole = async (id, currentRole, newRole) => {
    if (currentRole === newRole) {
      alert("The role is already set to the selected value.");
      return;
    }

    setLoadingChangeRole(true);
    try {
      const res = await axios.put("http://localhost:5000/users/promote", {
        id,
        role: currentRole,
      });
      alert(res.data.message);
      fetchUsers(); // รีเฟรชข้อมูล
    } catch (error) {
      console.error("Failed to change role:", error);
      alert("Failed to change role.");
    } finally {
      setLoadingChangeRole(false);
    }
  };

  // ลบผู้ใช้งาน
  const handleDelete = async (id, role) => {
    try {
      const res = await axios.delete(`http://localhost:5000/users/${id}`, {
        params: { role },
      });
      alert(res.data.message);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user.");
    }
  };

  // ฟังก์ชันค้นหา
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = orders.filter((order) =>
      [
        order.Cus_ID?.toString(), // แปลง ID เป็น string
        order.Cus_Name,
        order.Cus_Lname,
        order.Cus_Phone,
        order.Cus_Email,
        order.Location_From,
        order.Location_To,
        new Date(order.Order_Date).toLocaleString(), // แปลงวันที่เป็น string ที่สามารถค้นหาได้
      ]
        .join(" ") // รวมข้อความทั้งหมด
        .toLowerCase()
        .includes(term)
    );

    setFilteredOrders(filtered);
  };

  // เพิ่มข้อมูลผู้ใช้ใหม่
  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/users/add", newUser);
      alert(res.data.message);
      fetchUsers();
      setNewUser({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        phone: "",
        email: "",
        role: "user",
      });
      // ปิด Modal หลังเพิ่มข้อมูลสำเร็จ
      document.getElementById("closeAddUserModal").click();
    } catch (error) {
      console.error("Failed to add user:", error);
      alert("Failed to add user.");
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="sidebar bg-dark text-white p-3"
        style={{ minWidth: "250px", height: "100vh" }}
      >
        <h4>Admin Menu</h4>
        <hr />
        <ul className="nav flex-column">
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link text-white ${
                activeTab === "dashboard" ? "active" : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <i className="bi bi-house me-2"></i> Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link text-white ${
                activeTab === "manage" ? "active" : ""
              }`}
              onClick={() => setActiveTab("manage")}
            >
              <i className="bi bi-people me-2"></i> Manage Users
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link text-white ${
                activeTab === "orders" ? "active" : ""
              }`}
              onClick={() => setActiveTab("orders")}
            >
              <i className="bi bi-receipt me-2"></i> Manage Orders
            </button>
          </li>
        </ul>
        <hr />
        <div className="mt-auto">
          <p className="small">Logged in as:</p>
          <strong>{admin?.Emp_Name}</strong>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {activeTab === "dashboard" && (
          <div>
            <h1>
              Welcome, {admin?.Emp_Name} {admin?.Emp_Lname}
            </h1>
            <p className="lead">This is your admin dashboard.</p>

            {/* Dashboard Cards */}
            <div className="row text-center mb-4">
              <div className="col-md-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Users</h5>
                    <p className="card-text">Total: {stats.users}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Orders</h5>
                    <p className="card-text">Total: {stats.orders}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Revenue</h5>
                    <p className="card-text">${stats.revenue}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "manage" && (
          <div>
            <h1>Manage Users</h1>

            {/* Add New User Button */}
            <button
              className="btn btn-primary mb-3"
              data-bs-toggle="modal"
              data-bs-target="#addUserModal"
            >
              Add New User
            </button>

            {/* Add User Modal */}
            <div
              className="modal fade"
              id="addUserModal"
              tabIndex="-1"
              aria-labelledby="addUserModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="addUserModalLabel">
                      Add New User
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleAddUser}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newUser.firstName}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                firstName: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newUser.lastName}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                lastName: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Username</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newUser.username}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                username: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Password</label>
                          <input
                            type="password"
                            className="form-control"
                            value={newUser.password}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Phone</label>
                          <input
                            type="tel"
                            className="form-control"
                            value={newUser.phone}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                phone: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={newUser.email}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Role</label>
                        <select
                          className="form-select"
                          value={newUser.role}
                          onChange={(e) =>
                            setNewUser({ ...newUser, role: e.target.value })
                          }
                          required
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Add User
                      </button>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      id="closeAddUserModal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* User List */}
            <div className="card shadow-sm">
              <div className="card-header">
                <h5>User List</h5>
              </div>
              <div className="card-body">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{user.Username}</td>
                          <td>
                            {user.Cus_Name || user.Emp_Name}{" "}
                            {user.Cus_Lname || user.Emp_Lname}
                          </td>
                          <td>{user.Cus_Email || user.Emp_Email}</td>
                          <td>{user.Cus_Phone || user.Emp_Phone}</td>
                          <td>
                            <select
                              value={user.role}
                              className="form-select form-select-sm"
                              onChange={(e) =>
                                handleChangeRole(
                                  user.id,
                                  user.role,
                                  e.target.value
                                )
                              }
                            >
                              <option
                                value="user"
                                disabled={user.role === "user"}
                              >
                                User
                              </option>
                              <option
                                value="admin"
                                disabled={user.role === "admin"}
                              >
                                Admin
                              </option>
                            </select>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(user.id, user.role)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === "orders" && (
          <div>
            <h1>Manage Orders</h1>

            {/* Search Box */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="ค้นหา (Customer ID, Name, Phone, Email, Locations, Order Date)"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="card shadow-sm">
              <div className="card-body">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Order ID</th>
                        <th>Customer ID</th>
                        <th>Customer Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Pick-up Location</th>
                        <th>Delivery Location</th>
                        <th>Order Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, index) => (
                        <tr key={order.Order_ID}>
                          <td>{index + 1}</td>
                          <td>{order.Order_ID}</td>
                          <td>{order.Cus_ID}</td>
                          <td>
                            {order.Cus_Name} {order.Cus_Lname}
                          </td>
                          <td>{order.Cus_Phone}</td>
                          <td>{order.Cus_Email}</td>
                          <td>{order.Location_From}</td>
                          <td>{order.Location_To}</td>
                          <td>{new Date(order.Order_Date).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {/* No Results */}
                {filteredOrders.length === 0 && (
                  <p className="text-center mt-3">ไม่พบข้อมูลที่ค้นหา</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
