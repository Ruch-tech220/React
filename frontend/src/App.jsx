import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/AdminDashboard";
import About from "./components/About";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import AdminProfile from "./components/AdminProfile";
import Footer from "./components/Footer";
import Services from "./components/Services";
import OrderHistory from "./components/OrderHistory";
import OrderSummary from "./components/OrderSummary";
import OrderConfirmation from "./components/OrderConfirmation.jsx";

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            {/* เส้นทางสำหรับทุกคน */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/Services" element={<Services />} />{" "}
            <Route path="/order-summary" element={<OrderSummary />} />{" "}
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            {/* เส้นทางสำหรับ User */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute role="user">
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-history"
              element={
                <ProtectedRoute role="user">
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            {/* เส้นทางสำหรับ Admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute role="admin">
                  <AdminProfile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
