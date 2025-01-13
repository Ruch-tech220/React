import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <div className="container">
        <p className="mb-1">
          &copy; 2024 <strong>MyApp</strong>. All rights reserved.
        </p>
        <p className="mb-0">
          <a href="/privacy-policy" className="text-decoration-none text-white">
            Privacy Policy
          </a>{" "}
          |{" "}
          <a
            href="/terms-of-service"
            className="text-decoration-none text-white"
          >
            Terms of Service
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
