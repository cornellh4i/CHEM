"use client";
import React, { useState, useEffect } from "react";

// Define the option type to support both string and object formats
type SelectOption = string | { value: string; label: string };

interface SelectProps {
  label?: string;
  placeholder?: string;
  values?: SelectOption[];
  width?: string;
  disabled?: boolean;
  onSelect?: (value: string) => void; // Callback will always receive the value as string
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
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  // Helper function to get the label for display
  const getOptionLabel = (option: SelectOption): string => {
    if (typeof option === "string") {
      return option;
    }
    return option.label;
  };

  // Helper function to get the value
  const getOptionValue = (option: SelectOption): string => {
    if (typeof option === "string") {
      return option;
    }
    return option.value;
  };

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    if (!disabled || disabled == null) {
      setIsDropdownOpen((prev) => !prev);
    }
  };

  // Handle selecting a value from the dropdown
  const handleSelect = (option: SelectOption) => {
    const value = getOptionValue(option);
    const label = getOptionLabel(option);

    setSelectedValue(value);
    setSelectedLabel(label);
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{selectedLabel || placeholder}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <path
            d="M7 10l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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
          {values.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                backgroundColor:
                  selectedValue === getOptionValue(option) ? "#f5f5f5" : "#fff",
                color: "#6B7280",
                fontWeight: 400,
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#f5f5f5")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor =
                  selectedValue === getOptionValue(option) ? "#f0f0f0" : "#fff")
              }
            >
              {getOptionLabel(option)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
