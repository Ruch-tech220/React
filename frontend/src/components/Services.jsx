import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Services = () => {
  const [formData, setFormData] = useState({
    Cus_Name: "",
    Cus_Lname: "",
    Cus_Phone: "",
    Cus_Email: "",
    Location_From: "",
    Location_To: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const Cus_ID = user ? user.Cus_ID : null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Cus_ID) {
      alert("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        ...formData,
        Cus_ID, // เพิ่ม Cus_ID เข้าไปในข้อมูลที่ส่ง
      };

      // ส่งคำสั่งซื้อไปยัง API และรับคำตอบ
      const res = await axios.post(
        "http://localhost:5000/order/create",
        orderData
      );

      alert("การสั่งซื้อสำเร็จ!");
      setFormData({
        Cus_Name: "",
        Cus_Lname: "",
        Cus_Phone: "",
        Cus_Email: "",
        Location_From: "",
        Location_To: "",
      });

      // นำไปยังหน้าสรุปคำสั่งซื้อพร้อมข้อมูลคำสั่งซื้อ
      navigate("/order-summary", { state: orderData });
    } catch (error) {
      console.error("Error creating order:", error);
      alert("การสร้างคำสั่งซื้อไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">บริการขนส่งสินค้า</h1>
      <p className="text-center">
        กรุณากรอกข้อมูลด้านล่างเพื่อดำเนินการคำสั่งซื้อ
      </p>
      <form
        onSubmit={handleSubmit}
        className="mx-auto"
        style={{ maxWidth: "600px" }}
      >
        <div className="mb-3">
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
        <div className="mb-3">
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
        <div className="mb-3">
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
        <div className="mb-3">
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
        <div className="mb-3">
          <label className="form-label">สถานที่รับสินค้า</label>
          <textarea
            name="Location_From"
            value={formData.Location_From}
            onChange={handleChange}
            className="form-control"
            placeholder="กรอกสถานที่รับสินค้า"
            rows="2"
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">สถานที่จัดส่งสินค้า</label>
          <textarea
            name="Location_To"
            value={formData.Location_To}
            onChange={handleChange}
            className="form-control"
            placeholder="กรอกสถานที่จัดส่งสินค้า"
            rows="2"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "กำลังดำเนินการ..." : "ส่งคำสั่งซื้อ"}
        </button>
      </form>
    </div>
  );
};

export default Services;
