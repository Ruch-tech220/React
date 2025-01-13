const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();
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



// สมัครสมาชิก
app.post("/register", (req, res) => {
    const { Cus_Name, Cus_Lname, Username, Password, Cus_Phone, Cus_Email } = req.body;

    // ตรวจสอบว่าข้อมูลครบถ้วน
    if (!Cus_Name || !Cus_Lname || !Username || !Password || !Cus_Phone || !Cus_Email) {
        return res.status(400).send({ message: "All fields are required" });
    }

    const sql = `
      INSERT INTO tb_customer (Cus_Name, Cus_Lname, Username, Password, Cus_Phone, Cus_Email)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [Cus_Name, Cus_Lname, Username, Password, Cus_Phone, Cus_Email]; // เก็บ Password ดิบ

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).send({ message: "Username already exists" });
            }
            return res.status(500).send({ message: "Database error" });
        }

        // สมัครสำเร็จ ส่งข้อความตอบกลับ
        res.status(201).send({
            message: "User registered successfully",
            user: { Username, Password }, // ส่ง Username และ Password กลับไป
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
    const { Cus_ID, Cus_Name, Cus_Lname, Cus_Phone, Cus_Email, Location_From, Location_To } = req.body;

    if (!Cus_ID) {
        return res.status(400).send({ message: "Cus_ID is required" });
    }

    const sql = `
      INSERT INTO tb_order (Cus_ID, Cus_Name, Cus_Lname, Cus_Phone, Cus_Email, Location_From, Location_To)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [Cus_ID, Cus_Name, Cus_Lname, Cus_Phone, Cus_Email, Location_From, Location_To];

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Error creating order:", err);
            return res.status(500).send({ message: "Failed to create order" });
        }
        res.status(201).send({ message: "Order created successfully" });
    });
});

app.get("/orders", (req, res) => {
    const { Cus_ID } = req.query;

    let sql = `
      SELECT Order_ID, Cus_ID, Cus_Name, Cus_Lname, Cus_Phone, Cus_Email, Location_From, Location_To, Order_Date
      FROM tb_order
    `;
    const params = [];

    // กรองเฉพาะคำสั่งซื้อของลูกค้าหากส่ง Cus_ID มา
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


app.post("/calculate-price", (req, res) => {
    const { pickUpProvince, pickUpDistrict, deliveryProvince, deliveryDistrict } = req.body;

    // Mock ระยะทาง (km)
    const distance = Math.floor(Math.random() * 500) + 1; // 1 - 500 km

    // ราคาต่อกิโลเมตร
    const ratePerKm = 5; // 5 บาทต่อกิโลเมตร
    const baseServiceFee = 50; // ค่าบริการพื้นฐาน

    const price = distance * ratePerKm + baseServiceFee;

    res.status(200).send({ distance, price });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
