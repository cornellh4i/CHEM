"use client";

import React, { useState } from "react";
import { DefaultTemplate } from "@/components";
import Toast from "@/components/atoms/Toast"; // Adjust the path if needed

const AboutPage = () => {
  const [toastOpen, setToastOpen] = useState(false);

  const handleButtonClick = () => {
    setToastOpen(true);
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  return (
    <DefaultTemplate>
      <div>This is an about page</div>
      <button
        onClick={handleButtonClick}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#4A90E2",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Show Toast
      </button>
      <Toast open={toastOpen} onClose={handleCloseToast} duration={3000}>
        This is a test toast message!
      </Toast>
    </DefaultTemplate>
  );
};

export default AboutPage;
