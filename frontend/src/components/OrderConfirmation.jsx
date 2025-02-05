import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "./ThemeProvider";
import "../css/OrderConfirmation.css"; 
import Pic2 from "../assets/images/banner1.WEBP";

const OrderConfirmation = () => {
  // ดึงค่าโหมดแสง-มืด จาก ThemeContext
  const { isDarkMode } = useContext(ThemeContext);

  const location = useLocation();
  const navigate = useNavigate();

  // รับข้อมูล Order จาก state ที่ส่งมา
  const orderData = location.state;

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  // ถ้าไม่มีข้อมูล Order ให้รีเทิร์นหน้าบอกไม่พบข้อมูล
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

  // ฟังก์ชันบันทึกคำสั่งซื้อ
  const saveOrder = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const response = await axios.post("http://localhost:5000/orders", {
        Cus_ID: orderData.Cus_ID,
        Cus_Name: orderData.Cus_Name,
        Cus_Lname: orderData.Cus_Lname,
        Cus_Phone: orderData.Cus_Phone,
        Cus_Email: orderData.Cus_Email,
        Location_From: orderData.Location_From,
        Location_To: `${orderData.destinationProvince}, ${orderData.destinationDistrict}`,
        Distance: orderData.distance,
        Cost: orderData.cost,
      });

      if (response.status === 201) {
        setSaveStatus("คำสั่งซื้อของคุณได้รับการบันทึกแล้ว!");
        // ตัวอย่าง: ทำ Redirect ไปหน้า Home หลัง 2 วินาที
        setTimeout(() => navigate("/home"), 2000);
      } else {
        setSaveStatus("ไม่สามารถบันทึกคำสั่งซื้อได้");
      }
    } catch (error) {
      console.error("Failed to save order:", error);
      setSaveStatus("เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อ");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={`order-confirmation-page container-fluid p-0 ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <div className="main-content">
        {/* Header Section */}
        <header
          className={`header-section d-flex align-items-center justify-content-center shadow ${
            isDarkMode ? "dark-mode" : "light-mode"
          }`}
          style={{
            backgroundImage: `url(${Pic2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "40vh",
            position: "relative",
          }}
        >
          {/* Overlay */}
          <div className="order-summary-header-overlay"></div>
          <div className="overlay-text text-center text-light p-5 position-relative">
            <h1 className="display-3 fw-bold">ยืนยันคำสั่งซื้อ</h1>
            <p className="lead mt-3">
              ตรวจสอบรายละเอียดคำสั่งซื้อและบันทึกข้อมูลการจัดส่งได้ที่นี่
            </p>
          </div>
        </header>

        {/* Main Content */}
        <div className="container my-5">
          {/* การตกแต่งแบบเดียวกับหน้า Summary: shadow-sm, border-0, etc. */}
          <div
            className="card shadow-sm border-0 order-summary-card mx-auto"
            style={{ maxWidth: "600px" }}
          >
            {/* ถ้าต้องการ Header บนการ์ด (สีเขียว) */}
            <div className="card-header bg-success text-white text-center">
              <h2 className="card-title mb-0">คำสั่งซื้อได้รับการยืนยันแล้ว</h2>
            </div>

            <div className="card-body p-4">
              <div className="mb-3">
                <strong>ชื่อผู้สั่งซื้อ:</strong> {orderData?.Cus_Name}{" "}
                {orderData?.Cus_Lname}
              </div>
              <div className="mb-3">
                <strong>เบอร์โทรศัพท์:</strong> {orderData?.Cus_Phone}
              </div>
              <div className="mb-3">
                <strong>อีเมล:</strong> {orderData?.Cus_Email}
              </div>
              <div className="mb-3">
                <strong>สถานที่รับสินค้า:</strong> {orderData?.Location_From}
              </div>
              <div className="mb-3">
                <strong>สถานที่จัดส่งสินค้า:</strong>{" "}
                {orderData?.destinationProvince}, {orderData?.destinationDistrict}
              </div>

              {/* ใช้ icon ของ Bootstrap (bi-signpost-2) */}
              <div className="mb-3">
                <i className="bi bi-signpost-2 me-2 text-info"></i>
                <strong>ระยะทาง:</strong> {orderData?.distance} km
              </div>

              <div className="mb-3">
              <i className="bi bi-cash-coin me-2 text-success"></i>
                <strong>ค่าใช้จ่าย:</strong>{" "}
                {orderData?.cost ? `${orderData.cost} บาท` : "ไม่สามารถคำนวณได้"}
              </div>

              {/* แสดงสถานะการบันทึก */}
              {saveStatus && (
                <div
                  className={`alert ${
                    saveStatus.includes("ข้อผิดพลาด")
                      ? "alert-danger"
                      : "alert-info"
                  } text-center`}
                >
                  {saveStatus}
                </div>
              )}
            </div>

            <div className="card-footer text-center p-4">
              <button
                className="btn btn-success w-100"
                onClick={saveOrder}
                disabled={isSaving}
              >
                {isSaving ? "กำลังบันทึก..." : "ยืนยันคำสั่งซื้อ"}
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
      </div>
    </div>
  );
  
};

export default OrderConfirmation;
