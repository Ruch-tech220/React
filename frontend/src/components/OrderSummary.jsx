import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  const handleConfirm = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/order/create",
        orderData
      );
      alert(res.data.message);
      navigate("/order-confirmation", { state: orderData });
    } catch (error) {
      console.error("Failed to confirm order:", error);
      alert("การยืนยันคำสั่งซื้อไม่สำเร็จ");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">สรุปคำสั่งซื้อ</h1>
      <div className="card mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          <p>
            <strong>ชื่อ:</strong> {orderData.Cus_Name}
          </p>
          <p>
            <strong>นามสกุล:</strong> {orderData.Cus_Lname}
          </p>
          <p>
            <strong>เบอร์โทรศัพท์:</strong> {orderData.Cus_Phone}
          </p>
          <p>
            <strong>อีเมล:</strong> {orderData.Cus_Email}
          </p>
          <p>
            <strong>สถานที่รับสินค้า:</strong> {orderData.Location_From}
          </p>
          <p>
            <strong>สถานที่จัดส่งสินค้า:</strong> {orderData.Location_To}
          </p>
          <button className="btn btn-success w-100" onClick={handleConfirm}>
            ยืนยันคำสั่งซื้อ
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
