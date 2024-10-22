"use client"; // Add this to make the component a Client Component

import type { NextPage } from "next";
import { useState } from "react";
import { TableData, SimpleTable } from "@/components/atoms/SimpleTable"; // Adjust the path as needed

// Extended dummy data for multiple pages (10 rows)
const data: TableData[] = [
  // Page 1 data
  {
    date: "12/25/2024",
    contributor: "Theo Rumberg",
    fund: "Roberts Fund",
    type: "Endowment",
    documents: "Open documents",
    documentLink: "https://www.cornellh4i.org/", // Sample link for document
    units: 4.556,
    amount: 11508.97,
  },
  {
    date: "04/05/2024",
    contributor: "Sarah Clay",
    fund: "Roberts Fund",
    type: "Donation",
    documents: "---", // No document available
    units: "---",
    amount: -76342.43,
  },
  {
    date: "12/25/2024",
    contributor: "Theo Rumberg",
    fund: "Roberts Fund",
    type: "Endowment",
    documents: "Open documents",
    documentLink: "https://www.cornellh4i.org/", // Sample link for document
    units: 4.556,
    amount: 11508.97,
  },
  {
    date: "04/05/2024",
    contributor: "Sarah Clay",
    fund: "Roberts Fund",
    type: "Donation",
    documents: "---", // No document available
    units: "---",
    amount: -76342.43,
  },
  {
    date: "12/25/2024",
    contributor: "Theo Rumberg",
    fund: "Roberts Fund",
    type: "Endowment",
    documents: "Open documents",
    documentLink: "https://www.cornellh4i.org/", // Sample link for document
    units: 4.556,
    amount: 11508.97,
  },
  // Page 2 data (unique data)
  {
    date: "02/14/2024",
    contributor: "John Doe",
    fund: "Smith Fund",
    type: "Grant",
    documents: "Open documents",
    documentLink: "https://www.cornellh4i.org/", // Sample link for document
    units: 3.123,
    amount: 9500.00,
  },
  {
    date: "03/07/2024",
    contributor: "Jane Smith",
    fund: "Jones Fund",
    type: "Donation",
    documents: "---", // No document available
    units: "---",
    amount: -4500.50,
  },
  {
    date: "06/01/2024",
    contributor: "Alex Green",
    fund: "Brown Fund",
    type: "Endowment",
    documents: "Open documents",
    documentLink: "https://www.cornellh4i.org/", // Sample link for document
    units: 5.789,
    amount: 20000.00,
  },
  {
    date: "08/12/2024",
    contributor: "Emily White",
    fund: "Davis Fund",
    type: "Grant",
    documents: "Open documents",
    documentLink: "https://www.cornellh4i.org/", // Sample link for document
    units: 2.334,
    amount: 12000.75,
  },
  {
    date: "09/15/2024",
    contributor: "Mark Black",
    fund: "Wilson Fund",
    type: "Donation",
    documents: "---", // No document available
    units: "---",
    amount: -8600.00,
  },
];

// Page size (number of rows per page)
const PAGE_SIZE = 5;

const Home: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total number of pages
  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  // Get the data for the current page
  const currentPageData = data.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <SimpleTable
          data={currentPageData}
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Home;
