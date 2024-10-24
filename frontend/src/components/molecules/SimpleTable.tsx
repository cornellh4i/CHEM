import * as React from "react";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

// Define the type for table columns
export type Column<T> = {
  header: string; // Display name of the column in the table header
  accessor: keyof T | string; // Key to access data in each row object
  dataType: "string" | "number" | "date"; // Data type for sorting logic
  sortable?: boolean; // Indicates if the column is sortable
  Cell?: (value: any, row: T) => React.ReactNode; // Custom cell rendering function
  className?: string; // CSS classes for table cells
  headerClassName?: string; // CSS classes for header cells
};

// Define the props for the SimpleTable component
type SimpleTableProps<T> = {
  data: T[]; // Array of data objects to display
  columns: Column<T>[]; // Configuration of table columns
  pageSize: number; // Number of rows per page
};

// Reusable table component with sorting and pagination
export function SimpleTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize,
}: SimpleTableProps<T>) {
  // State for current page, sorting column, and sort order
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  // Handle sorting when a column header is clicked
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return; // Ignore if column is not sortable
    const columnKey = column.accessor as string;

    if (sortColumn === columnKey) {
      // Toggle sort order or reset if already descending
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortColumn(null);
        setSortOrder(null);
      } else {
        setSortOrder("asc");
      }
    } else {
      // Set new sort column and default to ascending
      setSortColumn(columnKey);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Memoized sorted data based on sort column and order
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortOrder) {
      return data;
    }

    const column = columns.find((col) => col.accessor === sortColumn);
    if (!column) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortColumn as keyof T];
      const bValue = b[sortColumn as keyof T];

      // Sort based on data type
      if (column.dataType === "date") {
        const aDate = new Date(aValue as string);
        const bDate = new Date(bValue as string);
        return aDate.getTime() - bDate.getTime();
      }

      if (column.dataType === "number") {
        return Number(aValue) - Number(bValue);
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue);
      }

      return 0; // Default case if data types do not match
    });

    return sortOrder === "desc" ? sorted.reverse() : sorted;
  }, [data, sortColumn, sortOrder, columns]);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Get data for the current page
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Helper function to handle empty values
  function checkEmpty(value: any): string {
    return value !== null && value !== undefined && String(value).trim() !== ""
      ? String(value)
      : "---";
  }

  // Handle page change when pagination buttons are clicked
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Render table headers */}
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={`cursor-pointer font-semibold text-black ${column.headerClassName}`}
                onClick={() => handleSort(column)}
              >
                {column.header} {/* Display sort icon if column is sorted */}
                {sortColumn === column.accessor &&
                  (sortOrder === "asc" ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownIcon />
                  ))}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Render table rows */}
          {paginatedData.length ? (
            paginatedData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => {
                  const cellValue = row[column.accessor as keyof T];
                  return (
                    <TableCell key={colIndex} className={column.className}>
                      {/* Use custom cell renderer if provided */}
                      {column.Cell
                        ? column.Cell(cellValue, row)
                        : checkEmpty(cellValue)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            // Display message if no data is available
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      <div className="mt-4 flex items-center justify-center">
        {/* Previous page button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 ${
            currentPage === 1 ? "cursor-not-allowed opacity-50" : "" }`}
        >
          <ChevronLeftIcon />
        </button>

        {/* Current page indicator */}
        <span className="px-3 py-2">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next page button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 ${
            currentPage === totalPages ? "cursor-not-allowed opacity-50" : "" }`}
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}
