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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const modal = document.querySelector('#receiptModal');
  const closeButton = modal?.querySelector('.btn-close');
  const modalSelector = '#receiptModal'
  const data = {
    hasModal: !!modal,
    hasCloseButton: !!closeButton,
  };
  if (closeButton) {
    closeButton.click();
  }
  const isModalClosed = !document.querySelector(modalSelector);
  data.isModalClosed = isModalClosed
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
        order.Order_ID,
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
            <div className="container-fluid p-4 ">
              <h2 className="mb-4 fw-bold border-bottom pb-2">
                📊 สถิติระบบ
              </h2>
              <div className="row g-4">
                {/* สมาชิกทั้งหมด */}
                <div className="col-12 col-md-6 col-xl-3">
                  <div className="card shadow-lg hover-shadow transform transition-all duration-300 h-100 bg-success bg-gradient">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-people-fill fs-2 me-2"></i>
                        <h5 className="card-title mb-0">สมาชิกทั้งหมด</h5>
                      </div>
                      <p className="card-text fs-1 fw-bold mt-auto">{stats.total_members} <span className="fs-4">คน</span></p>
                    </div>
                  </div>
                </div>

                {/* ออเดอร์ทั้งหมด */}
                <div className="col-12 col-md-6 col-xl-3">
                  <div className="card shadow-lg hover-shadow transform transition-all duration-300 h-100 bg-info bg-gradient">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-cart-check fs-2 me-2"></i>
                        <h5 className="card-title mb-0">ออเดอร์ทั้งหมด</h5>
                      </div>
                      <p className="card-text fs-1 fw-bold mt-auto">{stats.total_orders} <span className="fs-4">รายการ</span></p>
                    </div>
                  </div>
                </div>

                {/* ออเดอร์ค้าง処理 */}
                <div className="col-12 col-md-6 col-xl-3">
                  <div className="card shadow-lg hover-shadow transform transition-all duration-300 h-100 bg-warning bg-gradient">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-clock-history fs-2 me-2"></i>
                        <h5 className="card-title mb-0">ออเดอร์ที่ยังไม่เสร็จสิ้น</h5>
                      </div>
                      <p className="card-text fs-1 fw-bold mt-auto">{stats.total_pending_orders} <span className="fs-4">รายการ</span></p>
                    </div>
                  </div>
                </div>

                {/* ออเดอร์เสร็จสิ้น */}
                <div className="col-12 col-md-6 col-xl-3">
                  <div className="card shadow-lg hover-shadow transform transition-all duration-300 h-100 bg-danger bg-gradient">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-check-circle-fill fs-2 me-2"></i>
                        <h5 className="card-title mb-0">ออเดอร์ที่เสร็จสิ้นแล้ว</h5>
                      </div>
                      <p className="card-text fs-1 fw-bold mt-auto">{stats.total_completed_orders} <span className="fs-4">รายการ</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "manage" && (
            <div className="container-fluid p-4">
              {/* Header Section */}
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom">
                <h1 className="h2 fw-bold  ">
                  <i className="fas fa-users-cog me-3"></i>
                  จัดการสมาชิก
                </h1>
                <button
                  className="btn btn-primary px-4 py-2"
                  onClick={handleOpenModal}
                >
                  <i className="fas fa-user-plus me-2"></i>
                  เพิ่มข้อมูลผู้ใช้ใหม่
                </button>
              </div>

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

              {/* Member Table */}
              <div className="card border-0 shadow-lg">
                <div className="card-header bg-secondary text-white py-3">
                  <h5 className="mb-0">
                    <i className="fas fa-list-ul me-2"></i>
                    รายชื่อสมาชิก
                  </h5>
                </div>

                <div className="card-body p-0">
                  {loading ? (
                    <div className="text-center py-5 my-5">
                      <div
                        className="spinner-border text-primary"
                        style={{ width: '3rem', height: '3rem' }}
                        role="status"
                      >
                        <span className="visually-hidden">กำลังโหลดข้อมูล...</span>
                      </div>
                      <p className="mt-3 text-muted">กำลังโหลดข้อมูล...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th className="ps-4">#</th>
                            <th>สมาชิก</th>
                            <th>ชื่อ</th>
                            <th>อีเมล</th>
                            <th>เบอร์</th>
                            <th>ตำแหน่ง</th>
                            <th className="pe-4 text-end">จัดการ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user, index) => (
                            <tr key={index}>
                              <td className="ps-4 fw-medium text-muted">{index + 1}</td>
                              <td>
                                <span className="badge bg-danger text-danger bg-opacity-10">
                                  {user.Username}
                                </span>
                              </td>
                              <td className="fw-medium">
                                {user.Cus_Name || user.Emp_Name} {user.Cus_Lname || user.Emp_Lname}
                              </td>
                              <td>
                                <a
                                  href={`mailto:${user.Cus_Email || user.Emp_Email}`}
                                  className="text-decoration-none link-primary"
                                >
                                  {user.Cus_Email || user.Emp_Email}
                                </a>
                              </td>
                              <td>{user.Cus_Phone || user.Emp_Phone}</td>
                              <td>
                                <select
                                  value={user.role}
                                  className="form-select form-select-sm border-primary"
                                  onChange={(e) => handleChangeRole(user.id, user.role, e.target.value)}
                                >
                                  <option value="user" className="text-success">ผู้ใช้ทั่วไป</option>
                                  <option value="admin" className="text-danger">ผู้ดูแลระบบ</option>
                                </select>
                              </td>
                              <td className="pe-4 text-end">
                                <button
                                  className="btn btn-sm btn-danger px-3"
                                  onClick={() => handleDelete(user.id, user.role)}
                                >
                                  <i className="fas fa-trash-alt me-2"></i>
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
            <div className="container-fluid p-4">
              {/* Header Section */}
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom">
                <h1 className="h2 fw-bold ">
                  <i className="fas fa-truck-fast me-3"></i>
                  จัดการการจัดส่งสินค้า
                </h1>
              </div>

              {/* Receipt Modal */}
              {selectedOrder && (
                <div className="receipt-content">
                  <div className="receipt-header text-center mb-4 border-bottom pb-3">
                    <h2 className="fw-bold mb-2">
                      <i className="fas fa-receipt me-2"></i>
                      ใบรับคำสั่งซื้อ #{selectedOrder?.Order_ID}
                    </h2>
                    <small className="text-muted">วันที่ออกใบเสร็จ: {new Date().toLocaleDateString()}</small>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h5 className="fw-bold mb-3">ข้อมูลผู้ซื้อ</h5>
                      <p className="mb-1">
                        <i className="fas fa-user me-2"></i>
                        {selectedOrder?.Cus_Name} {selectedOrder?.Cus_Lname}
                      </p>
                      <p className="mb-1">
                        <i className="fas fa-id-card me-2"></i>
                        ID: {selectedOrder?.Cus_ID}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h5 className="fw-bold mb-3">ข้อมูลติดต่อ</h5>
                      <p className="mb-1">
                        <i className="fas fa-phone me-2"></i>
                        <a href={`tel:${selectedOrder?.Cus_Phone}`} className="text-decoration-none">
                          {selectedOrder?.Cus_Phone}
                        </a>
                      </p>
                      <p className="mb-1">
                        <i className="fas fa-envelope me-2"></i>
                        {selectedOrder?.Cus_Email}
                      </p>
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h5 className="fw-bold mb-3">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        ต้นทาง
                      </h5>
                      <p className="mb-0">{selectedOrder?.Location_From}</p>
                    </div>
                    <div className="col-md-6">
                      <h5 className="fw-bold mb-3">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        ปลายทาง
                      </h5>
                      <p className="mb-0">{selectedOrder?.Location_To}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="fw-bold mb-3">รายการสินค้า</h5>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>รายการ</th>
                            <th className="text-end">จำนวน</th>
                            <th className="text-end">ราคาต่อหน่วย</th>
                            <th className="text-end">รวม</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>สินค้าทั่วไป</td>
                            <td className="text-end">1 ชุด</td>
                            <td className="text-end">{selectedOrder?.Total_Cost?.toLocaleString()} บาท</td>
                            <td className="text-end fw-bold">
                              {selectedOrder?.Total_Cost?.toLocaleString()} บาท
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="row justify-content-end">
                    <div className="col-md-5">
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <tbody>
                            <tr>
                              <th>ยอดรวมทั้งสิ้น</th>
                              <td className="text-end fw-bold text-success">
                                {selectedOrder?.Total_Cost?.toLocaleString()} บาท
                              </td>
                            </tr>
                            <tr>
                              <th>สถานะการชำระเงิน</th>
                              <td className="text-end">
                                <span className={`badge ${selectedOrder?.status === 'เสร็จสิ้น' ? 'bg-success' : 'bg-warning'}`}>
                                  {selectedOrder?.status}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <button className="btn btn-outline-secondary" onClick={() => window.print()}>
                      <i className="fas fa-print me-2"></i>
                      พิมพ์ใบเสร็จ
                    </button>
                  </div>
                </div>
              )}

              {/* Search Bar */}
              <div className="mb-4">
                <div className="input-group input-group-lg shadow-sm">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="ค้นหาออเดอร์ (รหัสลูกค้า, ชื่อ, เบอร์, อีเมล, ต้นทาง, ปลายทาง, วันที่)"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>

              <div className="row g-4">
                {/* Pending Orders */}
                <div className="col-lg-6">
                  <div className="card border-danger shadow-lg">
                    <div className="card-header bg-danger text-white py-3">
                      <h3 className="mb-0">
                        <i className="fas fa-exclamation-circle me-2"></i>
                        ยังไม่สำเร็จ
                      </h3>
                    </div>
                    <div className="card-body p-0">
                      {loading ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">กำลังโหลดข้อมูล...</span>
                          </div>
                          <p className="mt-3 text-muted">กำลังโหลดข้อมูล...</p>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                              <tr>
                                <th className="ps-3">#</th>
                                <th>หมายเลขออเดอร์</th>
                                <th>ลูกค้า</th>
                                <th>ติดต่อ</th>
                                <th className="pe-3">สถานะ</th>
                                <th className="pe-3">การดำเนินการ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredOrders
                                .filter(order => order.status !== "เสร็จสิ้น")
                                .map((order, index) => (
                                  <tr key={order.Order_ID} className="border-start border-3 border-danger">
                                    <td className="ps-3 fw-medium text-muted">{index + 1}</td>
                                    <td>
                                      <span className="badge bg-dark bg-opacity-10 text-dark">
                                        #{order.Order_ID}
                                      </span>
                                    </td>
                                    <td>
                                      <div className="d-flex flex-column">
                                        <span className="fw-medium">{order.Cus_Name} {order.Cus_Lname}</span>
                                        <small className="text-muted">ID: {order.Cus_ID}</small>
                                      </div>
                                    </td>
                                    <td>
                                      <a href={`tel:${order.Cus_Phone}`} className="text-decoration-none">
                                        {order.Cus_Phone}
                                      </a>
                                    </td>
                                    <td className="pe-3">
                                      <div className="d-flex align-items-center">
                                        <select
                                          className={`form-select form-select-sm ${order.status === 'รอชำระ' ? 'border-warning'
                                            : order.status === 'กำลังดำเนินการ' ? 'border-primary'
                                              : 'border-success'
                                            }`}
                                          value={order.status}
                                          onChange={(e) => handleStatusChange(order.Order_ID, e.target.value)}
                                          disabled={loadingChangeStatus}
                                        >
                                          <option value="รอชำระ" className="text-warning">
                                            <i className="fas fa-clock me-2"></i>รอชำระ
                                          </option>
                                          <option value="กำลังดำเนินการ" className="text-primary">
                                            <i className="fas fa-spinner me-2"></i>กำลังดำเนินการ
                                          </option>
                                          <option value="เสร็จสิ้น" className="text-success">
                                            <i className="fas fa-check-circle me-2"></i>เสร็จสิ้น
                                          </option>
                                        </select>
                                        {loadingChangeStatus && (
                                          <div className="ms-2">
                                            <span className="spinner-border spinner-border-sm text-muted"></span>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                    <td className="pe-3">
                                      <button
                                        className="btn btn-sm btn-outline-secondary"
                                        data-bs-toggle="modal"
                                        data-bs-target="#receiptModal"
                                        onClick={() => setSelectedOrder(order)}
                                      >
                                        <i className="fas fa-receipt me-2"></i>
                                        ดูใบเสร็จ
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

                {/* Completed Orders */}
                <div className="col-lg-6">
                  <div className="card border-success shadow-lg">
                    <div className="card-header bg-success text-white py-3">
                      <h3 className="mb-0">
                        <i className="fas fa-check-circle me-2"></i>
                        สำเร็จแล้ว
                      </h3>
                    </div>
                    <div className="card-body p-0">
                      {loading ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">กำลังโหลดข้อมูล...</span>
                          </div>
                          <p className="mt-3 text-muted">กำลังโหลดข้อมูล...</p>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                              <tr>
                                <th className="ps-3">#</th>
                                <th>หมายเลขออเดอร์</th>
                                <th>ลูกค้า</th>
                                <th>ติดต่อ</th>
                                <th className="pe-3">สถานะ</th>
                                <th className="pe-3">การดำเนินการ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredOrders
                                .filter(order => order.status === "เสร็จสิ้น")
                                .map((order, index) => (
                                  <tr key={order.Order_ID} className="border-start border-3 border-success">
                                    <td className="ps-3 fw-medium text-muted">{index + 1}</td>
                                    <td>
                                      <span className="badge bg-dark bg-opacity-10 text-dark">
                                        #{order.Order_ID}
                                      </span>
                                    </td>
                                    <td>
                                      <div className="d-flex flex-column">
                                        <span className="fw-medium">{order.Cus_Name} {order.Cus_Lname}</span>
                                        <small className="text-muted">ID: {order.Cus_ID}</small>
                                      </div>
                                    </td>
                                    <td>
                                      <a href={`tel:${order.Cus_Phone}`} className="text-decoration-none">
                                        {order.Cus_Phone}
                                      </a>
                                    </td>
                                    <td className="pe-3">
                                      <div className="d-flex align-items-center">
                                        <select
                                          className="form-select form-select-sm border-success"
                                          value={order.status}
                                          onChange={(e) => handleStatusChange(order.Order_ID, e.target.value)}
                                          disabled={loadingChangeStatus}
                                        >
                                          <option value="รอชำระ" className="text-warning">
                                            <i className="fas fa-clock me-2"></i>รอชำระ
                                          </option>
                                          <option value="กำลังดำเนินการ" className="text-primary">
                                            <i className="fas fa-spinner me-2"></i>กำลังดำเนินการ
                                          </option>
                                          <option value="เสร็จสิ้น" className="text-success">
                                            <i className="fas fa-check-circle me-2"></i>เสร็จสิ้น
                                          </option>
                                        </select>
                                        {loadingChangeStatus && (
                                          <div className="ms-2">
                                            <span className="spinner-border spinner-border-sm text-muted"></span>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                    <td className="pe-3">
                                      <button
                                        className="btn btn-sm btn-outline-secondary"
                                        data-bs-toggle="modal"
                                        data-bs-target="#receiptModal"
                                        onClick={() => setSelectedOrder(order)}
                                      >
                                        <i className="fas fa-receipt me-2"></i>
                                        ดูใบเสร็จ
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
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
