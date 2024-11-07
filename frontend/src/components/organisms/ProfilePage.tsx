"use client";

import React, { useState } from "react";
import Button from "../atoms/Button";
import { useMediaQuery } from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";

type FormData = {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phoneNumber: string;
};

const ProfilePage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [formData, setFormData] = useState<FormData>({
    firstName: "Janice",
    lastName: "Smith",
    role: "Analyst",
    email: "jsmith@gmail.com",
    phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0px",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <form
        style={{
          display: "grid",
          gap: "1.5rem",
          width: isMobile ? "100%" : "600px",
        }}
      >
        <div style={{ gap: "1rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Your Profile
          </h2>
          {/* First and Last Name */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <div style={{ flex: 1 }}>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </div>
        </div>

        {/* Role and Email */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <div style={{ flex: 1 }}>
            <label>Your Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              readOnly
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                color: "#747474",
              }}
            />
            <small
              style={{
                color: "#888",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <InfoIcon
                style={{
                  width: "15px",
                  height: "auto",
                  marginRight: "4px",
                }}
              />
              This was assigned by your administrator
            </small>
          </div>
          <div style={{ flex: 1 }}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        {/* Password Section */}
        <div style={{ gap: "1rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Password
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "50%",
            }}
          >
            <Button
              style={{
                display: "inline-block",
                width: "auto",
                fontSize: "1rem",
                whiteSpace: "nowrap",
                padding: "10px",
              }}
              variant="secondary"
            >
              Change your password
            </Button>
            <Button
              style={{
                width: "auto",
                fontSize: "1rem",
                whiteSpace: "nowrap",
                padding: "10px",
              }}
              variant="secondary"
            >
              Reset your password
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
