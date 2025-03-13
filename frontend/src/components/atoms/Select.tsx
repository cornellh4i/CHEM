"use client";
import React, { useState, useEffect } from "react";

interface SelectProps {
  label?: string;
  placeholder?: string;
  values?: string[];
  width?: string;
  disabled?: boolean;
  onSelect?: (value: string) => void; // Add proper type for the callback
}

const Select = ({
  label,
  placeholder,
  values = [],
  width,
  disabled,
  onSelect,
}: SelectProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    if (!disabled || disabled == null) {
      setIsDropdownOpen((prev) => !prev);
    }
  };

  // Handle selecting a value from the dropdown
  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsDropdownOpen(false);

    // Call the onSelect callback with the selected value
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <div style={{ position: "relative", width: width || "100%" }}>
      <label className="text-gray-600 mb-2 mt-4 block text-sm font-normal">
        {label}
      </label>

      {/* Custom dropdown trigger */}
      <div
        onClick={toggleDropdown}
        className={`cursor-pointer rounded-lg p-2.5 ${
          disabled
            ? `bg-gray-300 text-black placeholder-transparent cursor-not-allowed`
            : "bg-gray-100"
          }`}
        style={{
          position: "relative",
          width: "100%",
        }}
      >
        {selectedValue || placeholder}
      </div>

      {/* Custom dropdown container */}
      {isDropdownOpen && (
        <div
          className="custom-dropdown"
          style={{
            position: "absolute",
            top: "100%",
            left: "70%",
            width: width ? `calc(${width} * 0.3)` : "30%",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            overflowY: "auto",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 999,
          }}
        >
          {values.map((value, index) => (
            <div
              key={index}
              onClick={() => handleSelect(value)}
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                backgroundColor: selectedValue === value ? "#f5f5f5" : "#fff",
                color: "#6B7280",
                fontWeight: 400,
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#f5f5f5")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor =
                  selectedValue === value ? "#f0f0f0" : "#fff")
              }
            >
              {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
