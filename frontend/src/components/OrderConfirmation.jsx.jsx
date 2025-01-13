import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation(); // รับข้อมูลคำสั่งซื้อจาก state
  const navigate = useNavigate();
  const orderData = location.state; // ข้อมูลคำสั่งซื้อ

  // ตรวจสอบว่ามีข้อมูลคำสั่งซื้อหรือไม่
  if (!orderData) {
    return (
      <div className="container mt-5 text-center">
        <h1>ไม่พบข้อมูลคำสั่งซื้อ</h1>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/services")}
        >
          กลับไปหน้าบริการ
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card mx-auto shadow" style={{ maxWidth: "600px" }}>
        <div className="card-header bg-success text-white text-center">
          <h2>คำสั่งซื้อได้รับการยืนยันแล้ว</h2>
        </div>
        <div className="card-body">
          <p className="text-center">
            ขอขอบคุณที่ใช้บริการ! คำสั่งซื้อของคุณได้รับการยืนยันแล้ว
          </p>
          <div className="mb-3">
            <strong>ชื่อผู้สั่งซื้อ:</strong> {orderData.Cus_Name}{" "}
            {orderData.Cus_Lname}
          </div>
          <div className="mb-3">
            <strong>เบอร์โทรศัพท์:</strong> {orderData.Cus_Phone}
          </div>
          <div className="mb-3">
            <strong>อีเมล:</strong> {orderData.Cus_Email}
          </div>
          <div className="mb-3">
            <strong>สถานที่รับสินค้า:</strong> {orderData.Location_From}
          </div>
          <div className="mb-3">
            <strong>สถานที่จัดส่งสินค้า:</strong> {orderData.Location_To}
          </div>
        </div>
        <div className="card-footer text-center">
          <button
            className="btn btn-primary w-100"
            onClick={() => navigate("/order-history")}
          >
            ดูประวัติคำสั่งซื้อ
          </button>
          <button
            className="btn btn-secondary w-100 mt-2"
            onClick={() => navigate("/services")}
          >
            สั่งซื้อใหม่
          </button>
          <button
            className="btn btn-primary w-100 mt-2"
            onClick={() => navigate("/home")}
          >
            กลับหน้าแรก
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
