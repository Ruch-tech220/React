const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");
const path = require("path");
const app = express();
const distances = require("./data/distances.json"); // โหลดระยะทางจากไฟล์ JSON
const bcrypt = require("bcrypt");

app.use(cors());
app.use(bodyParser.json());

// Middleware: ตรวจสอบข้อมูลที่จำเป็นใน Body
const validateBody = (requiredFields) => (req, res, next) => {
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).send({ message: `Missing fields: ${missingFields.join(", ")}` });
    }
    next();
};

// ฟังก์ชันตรวจสอบข้อมูลซ้ำ
const checkExistingUser = (email, username, phone, callback) => {
    const query = `
      SELECT * FROM tb_customer
      WHERE Cus_Email = ? OR Username = ? OR Cus_Phone = ?
    `;
    db.query(query, [email, username, phone], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

const handleStatusChange = async (orderId, newStatus) => {
    console.log("Updating status for Order ID:", orderId, "to", newStatus);

    try {
        const response = await fetch("http://localhost:5000/api/updateOrderStatus", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId, newStatus }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Server Response:", data);

        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.Order_ID === orderId ? { ...order, status: newStatus } : order
            )
        );
    } catch (error) {
        console.error("Error updating status:", error);
    }
};



// Login API
app.post("/login", (req, res) => {
    const { Username, Password } = req.body;

    // ตรวจสอบใน tb_customer
    const sqlUser = "SELECT * FROM tb_customer WHERE Username = ?";
    db.query(sqlUser, [Username], (err, userResults) => {
        if (err) return res.status(500).send({ message: "Server error", error: err });

        if (userResults.length > 0) {
            // ตรวจสอบ Password
            const user = userResults[0];
            if (user.Password === Password) {
                return res.status(200).send({
                    message: "Login successful",
                    role: "user",
                    user: {
                        Cus_ID: user.Cus_ID,
                        Cus_Name: user.Cus_Name,
                        Cus_Lname: user.Cus_Lname,
                        Username: user.Username,
                        Cus_Phone: user.Cus_Phone,
                        Cus_Email: user.Cus_Email,
                    },
                });
            } else {
                return res.status(401).send({ message: "Invalid Password" });
            }
        } else {
            // หากไม่พบใน tb_customer ตรวจสอบใน tb_employee
            const sqlAdmin = "SELECT * FROM tb_employee WHERE Username = ?";
            db.query(sqlAdmin, [Username], (err, adminResults) => {
                if (err) return res.status(500).send({ message: "Server error", error: err });

                if (adminResults.length > 0) {
                    // ตรวจสอบ Password
                    const admin = adminResults[0];
                    if (admin.Password === Password) {
                        return res.status(200).send({
                            message: "Login successful",
                            role: "admin",
                            user: {
                                Emp_ID: admin.Emp_ID,
                                Emp_Name: admin.Emp_Name,
                                Emp_Lname: admin.Emp_Lname,
                                Username: admin.Username,
                                Emp_Phone: admin.Emp_Phone,
                                Emp_Email: admin.Emp_Email,
                            },
                        });
                    } else {
                        return res.status(401).send({ message: "Invalid Password" });
                    }
                } else {
                    // ไม่พบ Username ในทั้งสองตาราง
                    return res.status(401).send({ message: "Username not found" });
                }
            });
        }
    });
});

app.get("/api/distances", (req, res) => {
    const filePath = path.join(__dirname, "data", "distances.json");

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Error sending distances.json:", err);
            return res.status(500).send({ message: "Failed to load distances.json" });
        }
    });
});




// สมัครสมาชิก
app.post("/register", (req, res) => {
    const { Cus_Name, Cus_Lname, Username, Password, Cus_Phone, Cus_Email } = req.body;

    // ตรวจสอบว่าข้อมูลครบถ้วน
    if (!Cus_Name || !Cus_Lname || !Username || !Password || !Cus_Phone || !Cus_Email) {
        return res.status(400).send({ message: "ต้องระบุข้อมูลทุกช่อง" });
    }

    // ตรวจสอบรูปแบบเบอร์โทรศัพท์ (ต้องเป็นตัวเลขเท่านั้น)
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(Cus_Phone)) {
        return res.status(400).send({ message: "หมายเลขโทรศัพท์ต้องมีเฉพาะตัวเลขเท่านั้น" });
    }

    // ตรวจสอบรูปแบบรหัสผ่าน (ภาษาอังกฤษ, ตัวเลข, เครื่องหมายเท่านั้น)
    const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+]*$/;
    if (!passwordRegex.test(Password)) {
        return res.status(400).send({ message: "รหัสผ่านต้องมีเฉพาะตัวอักษรภาษาอังกฤษ ตัวเลข หรือสัญลักษณ์เท่านั้น" });
    }


    // ตรวจสอบข้อมูลที่ซ้ำในฐานข้อมูล
    checkExistingUser(Cus_Email, Username, Cus_Phone, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "เกิดข้อผิดพลาดในการตรวจสอบข้อมูล" });
        }

        let errors = {};

        if (results.length > 0) {
            // สร้าง object เพื่อเก็บข้อผิดพลาดทั้งหมด
            const errors = {};

            // ตรวจสอบข้อมูลทีละฟิลด์
            if (results.some(user => user.Cus_Email === Cus_Email)) {
                errors.email = "อีเมลนี้ถูกใช้งานแล้ว";
            }
            if (results.some(user => user.Username === Username)) {
                errors.username = "ชื่อผู้ใช้นี้มีอยู่แล้ว";
            }
            if (results.some(user => user.Cus_Phone === Cus_Phone)) {
                errors.phone = "เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว";
            }

            // ถ้ามีข้อผิดพลาดใดๆ ส่งกลับทั้งหมดพร้อมกัน
            if (Object.keys(errors).length > 0) {
                return res.status(400).json({ errors });
            }
        }


        // ถ้าทุกอย่างโอเค ให้ทำการบันทึกข้อมูลลงฐานข้อมูล
        const sql = `
        INSERT INTO tb_customer (Cus_Name, Cus_Lname, Username, Password, Cus_Phone, Cus_Email)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
        const params = [Cus_Name, Cus_Lname, Username, Password, Cus_Phone, Cus_Email]; // เก็บ Password ดิบ

        db.query(sql, params, (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res.status(500).send({ message: "Database error" });
            }

            // สมัครสำเร็จ ส่งข้อความตอบกลับ
            res.status(201).send({
                message: "User registered successfully",
                user: { Username }, // ส่ง Username กลับไป
            });
        });
    });
});



// ดึงข้อมูลผู้ใช้งานทั้งหมด
app.get("/users", (req, res) => {
    const sqlCustomer = "SELECT 'user' AS role, Cus_ID AS id, Cus_Name, Cus_Lname, Username, Cus_Phone, Cus_Email FROM tb_customer";
    const sqlEmployee = "SELECT 'admin' AS role, Emp_ID AS id, Emp_Name, Emp_Lname, Username, Emp_Phone, Emp_Email FROM tb_employee";

    db.query(`${sqlCustomer} UNION ALL ${sqlEmployee}`, (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(results);
    });
});

// เพิ่มข้อมูลผู้ใช้ใหม่
app.post(
    "/users/add",
    validateBody(["firstName", "lastName", "username", "password", "phone", "email", "role"]),
    (req, res) => {
        const { firstName, lastName, username, password, phone, email, role } = req.body;

        const sql =
            role === "user"
                ? "INSERT INTO tb_customer (Cus_Name, Cus_Lname, Username, Password, Cus_Phone, Cus_Email) VALUES (?, ?, ?, ?, ?, ?)"
                : "INSERT INTO tb_employee (Emp_Name, Emp_Lname, Username, Password, Emp_Phone, Emp_Email) VALUES (?, ?, ?, ?, ?, ?)";
        const params = [firstName, lastName, username, password, phone, email];

        db.query(sql, params, (err, result) => {
            if (err) {
                console.error("Error adding user:", err);
                return res.status(500).send({ message: "Failed to add user" });
            }
            res.status(201).send({ message: `${role} added successfully` });
        });
    }
);


// อัปเดตข้อมูล User
app.put("/user/update", (req, res) => {
    const { Cus_ID, Cus_Name, Cus_Lname, Username, Password, Cus_Phone, Cus_Email } = req.body;

    const sql = `
      UPDATE tb_customer 
      SET Cus_Name = ?, Cus_Lname = ?, Username = ?, Password = ?, Cus_Phone = ?, Cus_Email = ?
      WHERE Cus_ID = ?
    `;
    db.query(sql, [Cus_Name, Cus_Lname, Username, Password, Cus_Phone, Cus_Email, Cus_ID], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send({ message: "User updated successfully" });
    });
});


// อัปเดตข้อมูล Admin
app.put("/admin/update", (req, res) => {
    const { Emp_ID, Emp_Name, Emp_Lname, Username, Password, Emp_Phone, Emp_Email } = req.body;

    const sql = `
      UPDATE tb_employee 
      SET Emp_Name = ?, Emp_Lname = ?, Username = ?, Password = ?, Emp_Phone = ?, Emp_Email = ?
      WHERE Emp_ID = ?
    `;
    db.query(sql, [Emp_Name, Emp_Lname, Username, Password, Emp_Phone, Emp_Email, Emp_ID], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send({ message: "Admin updated successfully" });
    });
});


// อัปเดตข้อมูล Order
app.post("/api/updateOrderStatus", (req, res) => {
    const { orderId, newStatus } = req.body;

    console.log("Received request to update:", orderId, "to", newStatus);

    if (!orderId || !newStatus) {
        return res.status(400).json({ message: "Missing orderId or newStatus" });
    }

    const sql = "UPDATE tb_order SET status = ? WHERE Order_ID = ?";
    db.query(sql, [newStatus, orderId], (err, result) => {
        if (err) {
            console.error("Error updating order status:", err);
            return res.status(500).json({ message: "Failed to update order status" });
        }

        console.log("Database Update Success:", result);
        res.status(200).json({ message: "Order status updated successfully", orderId, newStatus });
    });
});

//ปรับRole
app.put("/users/promote", (req, res) => {
    const { id, role } = req.body;

    if (role === "user") {
        // Promote User to Admin
        const sqlPromoteToAdmin = `
        INSERT INTO tb_employee (Emp_Name, Emp_Lname, Username, Password, Emp_Phone, Emp_Email)
        SELECT Cus_Name, Cus_Lname, Username, Password, Cus_Phone, Cus_Email
        FROM tb_customer
        WHERE Cus_ID = ?;
      `;
        const sqlDeleteFromCustomer = `
        DELETE FROM tb_customer WHERE Cus_ID = ?;
      `;

        db.query(sqlPromoteToAdmin, [id], (err) => {
            if (err) {
                console.error("Error promoting user to admin:", err);
                return res.status(500).send({ message: "Failed to promote user to admin" });
            }

            db.query(sqlDeleteFromCustomer, [id], (err) => {
                if (err) {
                    console.error("Error deleting user from tb_customer:", err);
                    return res.status(500).send({ message: "Failed to delete user from tb_customer" });
                }

                res.status(200).send({ message: "User promoted to Admin" });
            });
        });
    } else if (role === "admin") {
        // Demote Admin to User
        const sqlDemoteToUser = `
        INSERT INTO tb_customer (Cus_Name, Cus_Lname, Username, Password, Cus_Phone, Cus_Email)
        SELECT Emp_Name, Emp_Lname, Username, Password, Emp_Phone, Emp_Email
        FROM tb_employee
        WHERE Emp_ID = ?;
      `;
        const sqlDeleteFromEmployee = `
        DELETE FROM tb_employee WHERE Emp_ID = ?;
      `;

        db.query(sqlDemoteToUser, [id], (err) => {
            if (err) {
                console.error("Error demoting admin to user:", err);
                return res.status(500).send({ message: "Failed to demote admin to user" });
            }

            db.query(sqlDeleteFromEmployee, [id], (err) => {
                if (err) {
                    console.error("Error deleting admin from tb_employee:", err);
                    return res.status(500).send({ message: "Failed to delete admin from tb_employee" });
                }

                res.status(200).send({ message: "Admin demoted to User" });
            });
        });
    } else {
        res.status(400).send({ message: "Invalid role specified" });
    }
});

// ลบผู้ใช้งาน
app.delete("/users/:id", (req, res) => {
    const { role } = req.query;
    const { id } = req.params;

    const sql = role === "user" ? "DELETE FROM tb_customer WHERE Cus_ID = ?" : "DELETE FROM tb_employee WHERE Emp_ID = ?";
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).send({ message: "Failed to delete user", error: err });
        res.status(200).send({ message: "User deleted successfully" });
    });
});

// สร้างคำสั่งซื้อใหม่
app.post("/order/create", (req, res) => {
    const {
        Cus_ID,
        Cus_Name,
        Cus_Lname,
        Cus_Phone,
        Cus_Email,
        Location_From,
        Location_To,
        Distance,
        Total_Cost,
    } = req.body;

    // ตรวจสอบว่าข้อมูลครบถ้วน
    if (
        !Cus_ID ||
        !Cus_Name ||
        !Cus_Lname ||
        !Cus_Phone ||
        !Cus_Email ||
        !Location_From ||
        !Location_To ||
        Distance == null ||
        Total_Cost == null
    ) {
        return res.status(400).send({ message: "All fields are required" });
    }

    // ตรวจสอบคำสั่งซื้อซ้ำในวันเดียวกัน
    const checkDuplicateSQL = `
      SELECT * FROM tb_order 
      WHERE Cus_ID = ? AND Location_From = ? AND Location_To = ? AND DATE(Order_Date) = CURDATE()
    `;
    db.query(
        checkDuplicateSQL,
        [Cus_ID, Location_From, Location_To],
        (err, results) => {
            if (err) {
                console.error("Error checking for duplicates:", err);
                return res.status(500).send({ message: "Failed to check for duplicates" });
            }

            if (results.length > 0) {
                return res.status(409).send({ message: "Duplicate order found" });
            }

            // หากไม่มีคำสั่งซื้อซ้ำ ให้บันทึกข้อมูลใหม่
            const insertSQL = `
              INSERT INTO tb_order 
              (Cus_ID, Cus_Name, Cus_Lname, Cus_Phone, Cus_Email, Location_From, Location_To, Distance, Total_Cost, \`status\`) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const params = [
                Cus_ID,
                Cus_Name,
                Cus_Lname,
                Cus_Phone,
                Cus_Email,
                Location_From,
                Location_To,
                Distance,
                Total_Cost,
                "รอชำระ", // ✅ ใส่ค่า status ที่ต้องการ

            ];

            db.query(insertSQL, params, (err, result) => {
                if (err) {
                    console.error("Error creating order:", err);
                    return res.status(500).send({ message: "Failed to create order" });
                }

                res.status(201).send({
                    message: "Order created successfully",
                    orderID: result.insertId,
                });
            });
        }
    );
});


app.post("/orders", (req, res) => {
    console.log("Received data:", req.body); // เช็คค่าที่ได้รับจาก frontend
    const {
        Cus_ID,
        Cus_Name,
        Cus_Lname,
        Cus_Phone,
        Cus_Email,
        Location_From,
        Location_To,
        Distance,
        Cost,
        status, // รับค่า status
    } = req.body;

    if (
        !Cus_ID ||
        !Cus_Name ||
        !Cus_Lname ||
        !Cus_Phone ||
        !Cus_Email ||
        !Location_From ||
        !Location_To ||
        Distance == null ||
        Cost == null ||
        !status // ตรวจสอบว่ามีค่า status หรือไม่
    ) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    const sql = `
      INSERT INTO tb_order
  (Cus_ID, Cus_Name, Cus_Lname, Cus_Phone, Cus_Email, Location_From, Location_To, Distance, Total_Cost, \`status\`)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        Cus_ID,
        Cus_Name,
        Cus_Lname,
        Cus_Phone,
        Cus_Email,
        Location_From,
        Location_To,
        Distance,
        Cost,
        status // เพิ่ม status เข้าไปใน params
    ];

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Error inserting order:", err);
            return res.status(500).send({ message: "Failed to save order" });
        }
        res.status(201).send({ message: "Order saved successfully" });
    });
});


app.get("/orders", (req, res) => {
    const { Cus_ID } = req.query;

    let sql = `
    SELECT Order_ID, Cus_ID, Cus_Name, Cus_Lname, Cus_Phone, Cus_Email, Location_From, Location_To, Distance, Total_Cost, Order_Date, status
    FROM tb_order
  `;
    const params = [];

    // หากส่ง Cus_ID มา จะกรองเฉพาะคำสั่งซื้อของลูกค้าคนนั้น
    if (Cus_ID) {
        sql += ` WHERE Cus_ID = ?`;
        params.push(Cus_ID);
    }

    sql += ` ORDER BY Order_Date DESC`;

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error fetching orders:", err);
            return res.status(500).send({ message: "Failed to fetch orders" });
        }

        res.status(200).send(results);
    });
});

// API คำนวณค่าใช้จ่าย
app.post("/calculate-cost", (req, res) => {
    const { destinationProvince, destinationDistrict } = req.body;

    if (!destinationProvince || !destinationDistrict) {
        return res.status(400).send({ message: "Missing destination information" });
    }

    // ตรวจสอบว่า distances.json โหลดสำเร็จ
    if (!Array.isArray(distances)) {
        return res.status(500).send({ message: "Distances data not loaded" });
    }

    // ค้นหาจังหวัด
    const province = distances.find((p) => p.province === destinationProvince);
    if (!province) {
        console.error(`Province not found: ${destinationProvince}`);
        return res.status(404).send({ message: "Province not found" });
    }

    // ค้นหาอำเภอ
    const district = province.districts.find((d) => d.name === destinationDistrict);
    if (!district) {
        console.error(`District not found in ${destinationProvince}: ${destinationDistrict}`);
        return res.status(404).send({ message: "District not found" });
    }

    // คำนวณค่าใช้จ่าย
    const baseRate = 5; // บาทต่อกิโลเมตร
    const serviceFee = 50; // ค่าบริการพื้นฐาน
    const price = district.distance * baseRate + serviceFee;

    res.status(200).send({
        distance: district.distance,
        price,
    });
});



// 📌 สร้าง API สำหรับดึงจำนวนสมาชิก
app.get("/stats", (req, res) => {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM tb_customer) + (SELECT COUNT(*) FROM tb_employee) AS total_members,
        (SELECT COUNT(*) FROM tb_order) AS total_orders,
        (SELECT COUNT(*) FROM tb_order WHERE status = 'เสร็จสิ้น') AS total_completed_orders,
        (SELECT COUNT(*) FROM tb_order WHERE status IN ('รอชำระ', 'กำลังดำเนินการ')) AS total_pending_orders
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching stats:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results[0]); // ส่งข้อมูลออกไป
    });
});


// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
