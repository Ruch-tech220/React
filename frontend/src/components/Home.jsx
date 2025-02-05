import React, { useContext } from "react";
import "../css/Home.css";
import { ThemeContext } from "./ThemeProvider";
import Pic1 from "../assets/images/pic1.WEBP";
import Pic2 from "../assets/images/banner1.WEBP";

const Home = () => {
  const { isDarkMode } = useContext(ThemeContext);

  // อ่านข้อมูล user/admin จาก localStorage ถ้ามี
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));

  return (
    <div
      className={`home-page container-fluid p-0 ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <div className="main-content">
        {/* Header Section */}
        <header
          className={`header-section d-flex align-items-center justify-content-center position-relative ${
            isDarkMode ? "dark-mode" : "light-mode"
          }`}
          style={{
            backgroundImage: `url(${Pic2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "40vh",
          }}
        >
          {/* Overlay ทับบนรูปภาพ */}
          <div className="header-overlay"></div>
          <div className="overlay-text text-center text-light p-5 position-relative shadow-lg">
            <h1 className="display-3 fw-bold">
              {user?.Cus_Name || admin?.Emp_Name
                ? `สวัสดี, ${user?.Cus_Name || admin?.Emp_Name}`
                : "ยินดีต้อนรับสู่ระบบขนส่งสินค้า"}
            </h1>
            <p className="lead mb-0">
              {user || admin
                ? "คุณเข้าสู่ระบบเรียบร้อยแล้ว"
                : "เริ่มต้นการใช้งานด้วยการลงชื่อเข้าใช้หรือลงทะเบียน"}
            </p>
          </div>
        </header>

        {/* Description Section */}
        <div className="container description-section py-5">
          <div className="row align-items-center g-4">
            {/* รูปภาพ */}
            <div className="col-md-6 text-center">
              <img
                src={Pic1}
                alt="เกี่ยวกับเรา"
                className="img-fluid rounded shadow"
              />
            </div>
            {/* ข้อความ */}
            <div className="col-md-6">
              <h2 className="mb-4 fw-bold">เกี่ยวกับระบบขนส่งสินค้า</h2>
              <p className="fs-5">
                ระบบขนส่งสินค้าของเราได้รับการออกแบบมาเพื่อให้การจัดส่งสินค้าของคุณง่าย
                สะดวก และรวดเร็ว รองรับการส่งสินค้าทั้งในและนอกพื้นที่
                ด้วยบริการที่ปลอดภัยและมีประสิทธิภาพ
              </p>
              <p className="fs-5">
                เรามุ่งมั่นให้บริการที่ตอบโจทย์ทั้งสำหรับธุรกิจขนาดเล็ก
                และบุคคลทั่วไปที่ต้องการจัดส่งสินค้า
                พร้อมทั้งมีระบบติดตามสถานะการส่งสินค้าตลอดเวลา
              </p>
              <div className="mt-4">
                <a href="/services" className="btn btn-success btn-lg me-2 px-4">
                  เริ่มต้นใช้งาน
                </a>
                <a href="/about" className="btn btn-outline-primary btn-lg px-4">
                  อ่านเพิ่มเติม
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
