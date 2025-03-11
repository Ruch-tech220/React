import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Services.css"; // เพิ่มไฟล์ CSS
import { ThemeContext } from "./ThemeProvider";
import Pic2 from "../assets/images/banner1.WEBP"


const Services = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    Cus_Name: "",
    Cus_Lname: "",
    Cus_Phone: "",
    Cus_Email: "",
    Location_From: "หนองแค",
  });

  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/distances");
        if (Array.isArray(response.data)) {
          setProvinces(response.data);
        } else {
          throw new Error("Invalid provinces data format");
        }
      } catch (error) {
        console.error("Error loading provinces:", error);
        alert("ไม่สามารถโหลดข้อมูลจังหวัดได้ กรุณาลองใหม่อีกครั้ง");
      }
    };
    fetchProvinces();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ชื่อ - นามสกุล ไม่ให้มีตัวเลข (ลบตัวเลขอัตโนมัติ)
    if (name === "Cus_Name" || name === "Cus_Lname") {
      const newValue = value.replace(/\d/g, "");
      setFormData({ ...formData, [name]: newValue });
      return;
    }

    // เบอร์โทรศัพท์ ให้ใส่เฉพาะตัวเลข ไม่เกิน 10 หลัก
    if (name === "Cus_Phone") {
      // ลบทุกตัวอักษรที่ไม่ใช่ตัวเลข
      let newValue = value.replace(/\D/g, "");
      // ตัดเกิน 10 ตัว
      if (newValue.length > 10) {
        newValue = newValue.slice(0, 10);
      }
      setFormData({ ...formData, [name]: newValue });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleProvinceChange = (e) => {
    const provinceName = e.target.value;
    setSelectedProvince(provinceName);

    const selectedProvinceData = provinces.find(
      (province) => province.province === provinceName
    );
    setDistricts(selectedProvinceData ? selectedProvinceData.districts : []);
    setSelectedDistrict("");
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { Cus_Name, Cus_Lname, Cus_Phone, Cus_Email } = formData;
    const user = JSON.parse(localStorage.getItem("user"));
    const Cus_ID = user ? user.Cus_ID : null;

    if (!Cus_ID) {
      alert("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ");
      navigate("/login");
      return;
    }

    if (!Cus_Name || !Cus_Lname || !Cus_Phone || !Cus_Email) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (!selectedProvince || !selectedDistrict) {
      alert("กรุณาเลือกจังหวัดและอำเภอปลายทาง");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        Cus_ID,
        ...formData,
        destinationProvince: selectedProvince,
        destinationDistrict: selectedDistrict,
      };
      navigate("/order-summary", { state: orderData });
    } catch (error) {
      console.error("Error creating order:", error);
      alert("การสร้างคำสั่งซื้อไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`services-page container-fluid p-0 ${
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
          {/* ถ้าต้องการ Overlay เพื่อความชัดเจนของข้อความ สามารถใส่ได้ */}
          <div className="services-header-overlay"></div>

          <div className="overlay-text text-center text-light p-5 position-relative">
            <h1 className="display-3 fw-bold">บริการขนส่งสินค้าของเรา</h1>
            <p className="lead">
              เราพร้อมช่วยให้การจัดส่งสินค้าของคุณเป็นเรื่องง่ายและรวดเร็ว
            </p>
          </div>
        </header>

        {/* Form Section */}
        <div className="container mt-5">
          <h1 className="text-center mb-3">บริการขนส่งสินค้า</h1>
          <p className="text-center mb-4">
            กรุณากรอกข้อมูลด้านล่างเพื่อดำเนินการคำสั่งซื้อ
          </p>

          {error && <p className="text-danger text-center">{error}</p>}

          {!error && (
            <form onSubmit={handleSubmit} className="service-form">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">ชื่อ</label>
                  <input
                    type="text"
                    name="Cus_Name"
                    value={formData.Cus_Name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="กรอกชื่อ"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">นามสกุล</label>
                  <input
                    type="text"
                    name="Cus_Lname"
                    value={formData.Cus_Lname}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="กรอกนามสกุล"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    name="Cus_Phone"
                    value={formData.Cus_Phone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="กรอกเบอร์โทรศัพท์"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">อีเมล</label>
                  <input
                    type="email"
                    name="Cus_Email"
                    value={formData.Cus_Email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="กรอกอีเมล"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">สถานที่ต้นทาง</label>
                <input
                  type="text"
                  value="หนองแค"
                  className="form-control"
                  disabled
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">เลือกจังหวัดปลายทาง</label>
                  <select
                    className="form-select"
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                  >
                    <option value="">-- เลือกจังหวัด --</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.province}>
                        {province.province}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">เลือกอำเภอปลายทาง</label>
                  <select
                    className="form-select"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    disabled={!districts.length}
                  >
                    <option value="">-- เลือกอำเภอ --</option>
                    {districts.map((district) => (
                      <option key={district.name} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-info w-100 mt-3"
                disabled={loading}
              >
                {loading ? "กำลังดำเนินการ..." : "ส่งคำสั่งซื้อ"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
