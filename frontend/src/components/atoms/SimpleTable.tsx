"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';



// Define the table data structure
export type TableData = {
  date: string;
  contributor: string;
  fund: string;
  type: string;
  documents: string;
  documentLink?: string;  // Add a documentLink property
  units: number | string;
  amount: number;
};

// Modify the component to accept pagination props
type SimpleTableProps = {
  data: TableData[];
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
};

export function SimpleTable({
  data,
  currentPage,
  totalPages,
  handlePageChange,
}: SimpleTableProps) {
  return (
    <div className="w-full">
      <div className="">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black font-semibold">Date</TableHead>
              <TableHead className="text-black font-semibold">Contributor</TableHead>
              <TableHead className="text-black font-semibold">Fund</TableHead>
              <TableHead className="text-black font-semibold">Type</TableHead>
              <TableHead className="text-black font-semibold">Documents</TableHead>
              <TableHead className="text-black font-semibold">Units</TableHead>
              <TableHead className="text-right text-black font-semibold">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.contributor}</TableCell>
                  <TableCell>{row.fund}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>
                    {row.documentLink ? (
                      <a
                        href={row.documentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 underline flex items-center space-x-1"
                      >
                        <span>Open documents</span>
                        <OpenInNewIcon className="h-3.5 w-3.5 inline" /> {/* Icon for external link */}
                      </a>
                    ) : (
                      "---"
                    )}
                  </TableCell>
                  <TableCell>{row.units}</TableCell>
                  <TableCell className="text-right font-medium">
                    {row.amount > 0 ? (
                      <span style={{ color: "green" }}>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(row.amount)}
                      </span>
                    ) : (
                      <span style={{ color: "red" }}>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(row.amount)}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 ${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <ChevronLeftIcon/>
          </button>

          <span className="px-3 py-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 ${
              currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <ChevronRightIcon/>
          </button>
        </div>
      </div>
    </div>
  );
}
