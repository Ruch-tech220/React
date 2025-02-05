import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "./ThemeProvider";
import "../css/OrderSummary.css";
import Pic2 from "../assets/images/banner1.WEBP";

const OrderSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ดึง isDarkMode จาก ThemeContext
  const { isDarkMode } = useContext(ThemeContext);

  // รับข้อมูล orderData จาก state
  const orderData = location.state;

  const [cost, setCost] = useState(null);
  const [loading, setLoading] = useState(true);

  // ตรวจสอบข้อมูลและคำนวณค่าใช้จ่ายเมื่อหน้าโหลด
  useEffect(() => {
    const calculateCost = async () => {
      if (!orderData?.destinationProvince || !orderData?.destinationDistrict) {
        alert("ข้อมูลปลายทางไม่สมบูรณ์");
        navigate("/services");
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/calculate-cost", {
          origin: orderData.Location_From,
          destinationProvince: orderData.destinationProvince,
          destinationDistrict: orderData.destinationDistrict,
        });

        setCost(response.data);
      } catch (error) {
        console.error("Error calculating cost:", error);
        alert("เกิดข้อผิดพลาดในการคำนวณค่าใช้จ่าย กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };

    calculateCost();
  }, [orderData, navigate]);

  // ฟังก์ชันยืนยันคำสั่งซื้อ
  const confirmOrder = () => {
    if (!cost) {
      alert("ข้อมูลไม่ครบถ้วน ไม่สามารถยืนยันคำสั่งซื้อได้");
      return;
    }

    navigate("/order-confirmation", {
      state: {
        ...orderData,
        distance: cost.distance,
        cost: cost.price,
      },
    });
  };

  return (
    <div
      className={`order-summary-page container-fluid p-0 ${
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
          }}
        >
          {/* ถ้าต้องการ Overlay สามารถเพิ่ม element ด้านล่างได้ */}
          <div className="order-summary-header-overlay"></div>

          <div className="overlay-text text-center text-light p-5 position-relative">
            <h1 className="display-3 fw-bold">สรุปคำสั่งซื้อ</h1>
            <p className="lead mt-3">
              ตรวจสอบรายละเอียดคำสั่งซื้อ และยืนยันการจัดส่งได้ที่นี่
            </p>
          </div>
        </header>

        {/* เนื้อหาหลักของ Order Summary */}
        <div className="container my-5">
          <div className="card shadow-sm border-0 order-summary-card">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">รายละเอียดคำสั่งซื้อ</h2>

              <div className="mb-3">
                <strong>ชื่อผู้สั่งซื้อ:</strong> {orderData?.Cus_Name}{" "}
                {orderData?.Cus_Lname}
              </div>
              <div className="mb-3">
                <strong>เบอร์โทร:</strong> {orderData?.Cus_Phone}
              </div>
              <div className="mb-3">
                <strong>อีเมล:</strong> {orderData?.Cus_Email}
              </div>

              <hr />

              {/* สถานที่ต้นทาง */}
              <div className="mb-3">
                <strong>สถานที่ต้นทาง:</strong> {orderData?.Location_From}
              </div>

              {/* สถานที่ปลายทาง */}
              <div className="mb-3">
                <strong>จังหวัดปลายทาง:</strong> {orderData?.destinationProvince}
              </div>
              <div className="mb-3">
                <strong>อำเภอปลายทาง:</strong> {orderData?.destinationDistrict}
              </div>

              <hr />

              {/* แสดงผลลัพธ์การคำนวณ */}
              {loading ? (
                <p className="text-center text-secondary my-4">
                  กำลังคำนวณค่าใช้จ่าย...
                </p>
              ) : cost ? (
                <div className="calculation-result mt-3">
                  <h4 className="mb-3">ผลลัพธ์การคำนวณ</h4>
                  <p>
                    <i className="bi bi-signpost-2 me-2 text-info"></i>
                    ระยะทาง: {cost.distance} km
                  </p>
                  <p>
                    <i className="bi bi-cash-coin me-2 text-success"></i>
                    ค่าใช้จ่าย: {cost.price} บาท
                  </p>
                  <button
                    className="btn btn-success w-100 mt-4"
                    onClick={confirmOrder}
                  >
                    ยืนยันคำสั่งซื้อ
                  </button>
                </div>
              ) : (
                <p className="text-danger text-center mt-4">
                  ไม่สามารถคำนวณค่าใช้จ่ายได้
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
