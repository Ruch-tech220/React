import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderHistory = () => {
  const user = JSON.parse(localStorage.getItem("user")); // ดึงข้อมูล User จาก localStorage
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/orders?Cus_ID=${user.Cus_ID}`
        );
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user.Cus_ID]);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Order History</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>From</th>
              <th>To</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.Order_ID}>
                <td>{index + 1}</td>
                <td>{order.Location_From}</td>
                <td>{order.Location_To}</td>
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
