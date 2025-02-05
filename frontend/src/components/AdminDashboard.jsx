import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "./ThemeProvider";
import "../css/AdminDashboard.css";

const AdminDashboard = () => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const { isDarkMode } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    total_members: 0,
    total_orders: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    phone: "",
    email: "",
    role: "user",
  });
  const [loadingChangeStatus, setLoadingChangeStatus] = useState(false);
  const [loadingChangeRole, setLoadingChangeRole] = useState(false);

  // โหลดข้อมูลตามแท็บที่เลือก
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

  useEffect(() => {
    fetchStats();
  }, []);

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
  const handleChangeRole = async (id, currentRole, newRole) => {
    if (currentRole === newRole) {
      alert("ตำแหน่งนี้ถูกตั้งค่าไว้แล้ว");
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
      alert("ไม่สามารถเปลี่ยนตำแหน่งได้");
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
      alert("ไม่สามารถลบผู้ใช้งานได้");
    }
  };

  // ฟังก์ชันค้นหา
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = orders.filter((order) =>
      [
        order.Cus_ID?.toString(),
        order.Cus_Name,
        order.Cus_Lname,
        order.Cus_Phone,
        order.Cus_Email,
        order.Location_From,
        order.Location_To,
        new Date(order.Order_Date).toLocaleString(),
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
    setFilteredOrders(filtered);
  };

  // เปิดและปิด modal
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // ลบ backdrop ซ้ำซ้อนเมื่อ modal ปิด
  useEffect(() => {
    if (!showModal) {
      document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
        backdrop.remove();
      });
      document.body.classList.remove("modal-open");
    }
  }, [showModal]);

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
      document.getElementById("closeAddUserModal").click();
    } catch (error) {
      console.error("Failed to add user:", error);
      alert("ไม่สามารถเพิ่มผู้ใช้งานได้");
    }
  };

  // อัปเดตสถานะคำสั่งซื้อ
  const handleStatusChange = async (orderId, newStatus) => {
    console.log("Updating status for Order ID:", orderId, "to", newStatus);
    try {
      const response = await fetch("http://localhost:5000/api/updateOrderStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, newStatus }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Server Response:", data);
      // อัปเดตสถานะใน state โดยไม่ต้องรีเฟรชหน้า
      setLoadingChangeStatus(true);
      try {
        const response = await axios.post("http://localhost:5000/api/updateOrderStatus", {
          orderId,
          newStatus,
        });
        alert(response.data.message);
        fetchOrders();
      } catch (error) {
        console.error("Failed to update status:", error);
        alert("ไม่สามารถเปลี่ยนสถานะได้");
      } finally {
        setLoadingChangeStatus(false);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className={`container-fluid admin-dashboard ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar text-white p-3 shadow">
          <div className="position-sticky">
            <h4 className="mb-4">
              <i className="bi bi-gear-fill me-2"></i> แอดมินเมนู
            </h4>
            <ul className="nav nav-pills flex-column mb-auto">
              <li className="nav-item">
                <button
                  className={`nav-link text-white mb-2 ${activeTab === "dashboard" ? "active bg-secondary" : ""}`}
                  onClick={() => setActiveTab("dashboard")}
                >
                  <i className="bi bi-house me-2"></i> แดชบอร์ด
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link text-white mb-2 ${activeTab === "manage" ? "active bg-secondary" : ""}`}
                  onClick={() => setActiveTab("manage")}
                >
                  <i className="bi bi-people me-2"></i> จัดการสมาชิก
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link text-white mb-2 ${activeTab === "orders" ? "active bg-secondary" : ""}`}
                  onClick={() => setActiveTab("orders")}
                >
                  <i className="bi bi-receipt me-2"></i> จัดการการจัดส่งสินค้า
                </button>
              </li>
            </ul>
            <hr className="border-light" />
            <div className="mt-4">
              <p className="small mb-0">ล็อคอินในนาม:</p>
              <strong>{admin?.Emp_Name}</strong>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          {activeTab === "dashboard" && (
            <div>
              <h2 className="mb-4">สถิติระบบ</h2>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card text-white bg-success shadow">
                    <div className="card-body">
                      <h5 className="card-title">สมาชิกทั้งหมด</h5>
                      <p className="card-text fs-4">{stats.total_members} คน</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card text-white bg-info shadow">
                    <div className="card-body">
                      <h5 className="card-title">จำนวนออเดอร์ทั้งหมด</h5>
                      <p className="card-text fs-4">{stats.total_orders} รายการ</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "manage" && (
            <div>
              <h1 className="mb-4">จัดการสมาชิก</h1>
              <button className="btn btn-primary mb-3" onClick={handleOpenModal}>
                เพิ่มข้อมูลผู้ใช้ใหม่
              </button>

              {/* Modal */}
              {showModal && (
                <>
                  <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-scrollable">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">เพิ่มข้อมูลผู้ใช้ใหม่</h5>
                          <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                          <form onSubmit={handleAddUser}>
                            <div className="row">
                              <div className="col-md-6 mb-3">
                                <label className="form-label">ชื่อ</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={newUser.firstName}
                                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-md-6 mb-3">
                                <label className="form-label">นามสกุล</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={newUser.lastName}
                                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6 mb-3">
                                <label className="form-label">ชื่อผู้ใช้</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={newUser.username}
                                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-md-6 mb-3">
                                <label className="form-label">รหัสผ่าน</label>
                                <input
                                  type="password"
                                  className="form-control"
                                  value={newUser.password}
                                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6 mb-3">
                                <label className="form-label">เบอร์โทร</label>
                                <input
                                  type="tel"
                                  className="form-control"
                                  value={newUser.phone}
                                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-md-6 mb-3">
                                <label className="form-label">อีเมล</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  value={newUser.email}
                                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                            <div className="mb-3">
                              <label className="form-label">ตำแหน่ง</label>
                              <select
                                className="form-select"
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                required
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                            </div>
                            <div className="modal-footer p-0">
                              <button type="submit" className="btn btn-primary me-2">
                                เพิ่มข้อมูลผู้ใช้ใหม่
                              </button>
                              <button type="button" className="btn btn-secondary" onClick={handleCloseModal} id="closeAddUserModal">
                                ปิด
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-backdrop fade show"></div>
                </>
              )}

              {/* ตารางแสดงรายชื่อสมาชิก */}
              <div className="card shadow-sm">
                <div className="card-header">
                  <h5 className="mb-0">รายชื่อสมาชิก</h5>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div className="text-center my-4">
                      <div className="spinner-border text-primary" role="status"></div>
                      <p>กำลังโหลดข้อมูล...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-striped align-middle">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>สมาชิก</th>
                            <th>ชื่อ</th>
                            <th>อีเมล</th>
                            <th>เบอร์</th>
                            <th>ตำแหน่ง</th>
                            <th>จัดการ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{user.Username}</td>
                              <td>
                                {user.Cus_Name || user.Emp_Name} {user.Cus_Lname || user.Emp_Lname}
                              </td>
                              <td>{user.Cus_Email || user.Emp_Email}</td>
                              <td>{user.Cus_Phone || user.Emp_Phone}</td>
                              <td>
                                <select
                                  value={user.role}
                                  className="form-select form-select-sm"
                                  onChange={(e) => handleChangeRole(user.id, user.role, e.target.value)}
                                >
                                  <option value="user" disabled={user.role === "user"}>
                                    User
                                  </option>
                                  <option value="admin" disabled={user.role === "admin"}>
                                    Admin
                                  </option>
                                </select>
                              </td>
                              <td>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id, user.role)}>
                                  ลบ
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h1 className="mb-4">จัดการการจัดส่งสินค้า</h1>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="ค้นหา (รหัสลูกค้า, ชื่อ, เบอร์, อีเมล, ต้นทาง, ปลายทาง, วันที่)"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="card shadow-sm">
                <div className="card-body">
                  {loading ? (
                    <div className="text-center my-4">
                      <div className="spinner-border text-primary" role="status"></div>
                      <p>กำลังโหลดข้อมูล...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-striped align-middle">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>หมายเลขออเดอร์</th>
                            <th>รหัสลูกค้า</th>
                            <th>ชื่อ</th>
                            <th>เบอร์</th>
                            <th>อีเมล</th>
                            <th>ต้นทาง</th>
                            <th>ปลายทาง</th>
                            <th>ระยะทาง</th>
                            <th>ราคา</th>
                            <th>วันที่</th>
                            <th>สถานะ</th>
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
                              <td>{order.Distance} km</td>
                              <td>{order.Total_Cost} บาท</td>
                              <td>{new Date(order.Order_Date).toLocaleString()}</td>
                              <td>
                                <select
                                  className={`form-select ${loadingChangeStatus ? "disabled" : ""}`}
                                  value={order.status}
                                  onChange={(e) => handleStatusChange(order.Order_ID, e.target.value)}
                                  disabled={loadingChangeStatus}
                                >
                                  <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                                  <option value="รอชำระ">รอชำระ</option>
                                  <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                                </select>
                                {loadingChangeStatus && <span className="text-muted ms-2">กำลังเปลี่ยนสถานะ...</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {filteredOrders.length === 0 && !loading && (
                    <p className="text-center mt-3">ไม่พบข้อมูลที่ค้นหา</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
