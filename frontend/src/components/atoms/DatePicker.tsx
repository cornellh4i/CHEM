"use client";

import * as React from "react";

export function DataPicker() {
  const [month, setMonth] = React.useState<string>("");
  const [day, setDay] = React.useState<string>("");
  const [year, setYear] = React.useState<string>("");

  // Handle month change
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value) && parseInt(value) <= 12) {
      setMonth(value);
    }
  };

  // Handle day change
  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value) && parseInt(value) <= 31) {
      setDay(value);
    }
  };

  // Handle year change
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setYear(value);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        maxLength={2}
        value={month}
        onChange={handleMonthChange}
        placeholder="MM"
        className="w-12 text-center border border-gray-300 p-2"
      />
      /
      <input
        type="text"
        maxLength={2}
        value={day}
        onChange={handleDayChange}
        placeholder="DD"
        className="w-12 text-center border border-gray-300 p-2"
      />
      /
      <input
        type="text"
        maxLength={4}
        value={year}
        onChange={handleYearChange}
        placeholder="YYYY"
        className="w-16 text-center border border-gray-300 p-2"
      />
    </div>
  );
}
