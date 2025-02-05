import React, { useContext } from "react";
import "../css/About.css";
import { ThemeContext } from "./ThemeProvider";
import Pic2 from "../assets/images/banner1.WEBP";

const About = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={`about-page container-fluid p-0 ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <div className="main-content">
        {/* Header Section */}
        <header
          className={`header-section d-flex align-items-center justify-content-center shadow position-relative ${
            isDarkMode ? "dark-mode" : "light-mode"
          }`}
          style={{
            backgroundImage: `url(${Pic2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "40vh",
          }}
        >
          {/* ชั้นสีทับ (Overlay)  */}
          <div className="header-overlay"></div>
          <div className="overlay-text text-center text-light p-5 position-relative">
            <h1 className="display-3 fw-bold">เกี่ยวกับเรา</h1>
            <p className="lead mt-3">
              ระบบขนส่งสินค้าของเรา ออกแบบมาเพื่อความสะดวก รวดเร็ว และปลอดภัย
              มุ่งเน้นให้บริการลูกค้าทุกระดับอย่างมืออาชีพ
            </p>
          </div>
        </header>

        {/* Content Section */}
        <div className="container py-5">
          <h2 className="text-center mb-5 fw-bold">บริการของเรา</h2>
          <div className="row text-center">
            <div className="col-md-4 mb-5">
              <div className="feature-icon">
                <i className="bi bi-truck fs-1 text-primary"></i>
              </div>
              <h5 className="mt-4 fw-semibold">ขนส่งรวดเร็ว</h5>
              <p className="mt-2">
                ส่งของถึงที่อย่างรวดเร็ว ด้วยบริการที่ครอบคลุมทุกพื้นที่
              </p>
            </div>
            <div className="col-md-4 mb-5">
              <div className="feature-icon">
                <i className="bi bi-shield-check fs-1 text-success"></i>
              </div>
              <h5 className="mt-4 fw-semibold">ปลอดภัย</h5>
              <p className="mt-2">
                มั่นใจในความปลอดภัย ด้วยระบบที่ทันสมัยและเชื่อถือได้
              </p>
            </div>
            <div className="col-md-4 mb-5">
              <div className="feature-icon">
                <i className="bi bi-geo-alt fs-1 text-danger"></i>
              </div>
              <h5 className="mt-4 fw-semibold">ครอบคลุมทุกพื้นที่</h5>
              <p className="mt-2">
                ให้บริการครอบคลุมทั้งในประเทศและระหว่างประเทศ
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="contact-section text-center py-5">
          <h2 className="mb-4 fw-bold">ข้อมูลการติดต่อ</h2>
          <p className="fs-5 mb-4">เรายินดีที่จะตอบทุกคำถามของคุณ</p>
          <div className="d-flex flex-column align-items-center">
            <p className="mb-2">
              <i className="bi bi-envelope fs-4 text-primary me-2"></i>
              อีเมล:{" "}
              <a href="mailto:contact@logistics.com" className="contact-link">
                contact@logistics.com
              </a>
            </p>
            <p>
              <i className="bi bi-telephone fs-4 text-success me-2"></i>
              เบอร์โทร:{" "}
              <a href="tel:+66812345678" className="contact-link">
                081-234-5678
              </a>
            </p>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="social-section text-center py-5">
          <h2 className="mb-4 fw-bold">ติดตามเรา</h2>
          <div className="d-flex justify-content-center gap-4">
            <a
              href="https://facebook.com"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-facebook fs-2 text-primary"></i>
            </a>
            <a
              href="https://twitter.com"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-twitter fs-2 text-info"></i>
            </a>
            <a
              href="https://instagram.com"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-instagram fs-2 text-danger"></i>
            </a>
            <a
              href="https://linkedin.com"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-linkedin fs-2 text-primary"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
