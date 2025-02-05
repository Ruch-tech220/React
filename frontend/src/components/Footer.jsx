import React, { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";

const Footer = () => {
  const { isDarkMode } = useContext(ThemeContext); // ใช้ ThemeContext

  return (
    <footer
      className={`text-center py-3 mt-auto ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <div className="container">
        <p className="mb-1">
          &copy; {new Date().getFullYear()} <strong>เก้าแสนทรานสปอร์ต</strong>. All rights
          reserved.
        </p>
        <p className="mb-0">
          <a
            href="/privacy-policy"
            className="text-decoration-none footer-link"
          >
            Privacy Policy
          </a>{" "}
          |{" "}
          <a
            href="/terms-of-service"
            className="text-decoration-none footer-link"
          >
            Terms of Service
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
