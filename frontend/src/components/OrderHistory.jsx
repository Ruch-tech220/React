import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrderHistory = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนเข้าหน้านี้");
      navigate("/login"); 
      return;
    }

    
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/orders?Cus_ID=${user.Cus_ID}`
        );
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        alert("ไม่สามารถดึงประวัติคำสั่งซื้อได้");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  return (
    <div className="container mt-5">
      <h1 className="text-center">ประวัติคำสั่งซื้อ</h1>
      {loading ? (
        <p className="text-center">กำลังโหลดข้อมูล...</p>
      ) : orders.length === 0 ? (
        <p className="text-center">ไม่พบประวัติคำสั่งซื้อ</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>ต้นทาง</th>
              <th>ปลายทาง</th>
              <th>ระยะทาง (km)</th>
              <th>จำนวน (฿)</th>
              <th>วันที่</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.Order_ID}>
                <td>{index + 1}</td>
                <td>{order.Location_From}</td>
                <td>{order.Location_To}</td>
                <td>{order.Distance}</td>
                <td>{order.Total_Cost}</td>
                <td>{new Date(order.Order_Date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;
