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

export type Column<T> = {
  header: string;
  accessor: keyof T | string;
  dataType: "string" | "number" | "date";
  sortable?: boolean;
  Cell?: (value: any, row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
};

type SimpleTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  pageSize: number;
};

export function SimpleTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize,
}: SimpleTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;
    const columnKey = column.accessor as string;

    if (sortColumn === columnKey) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortColumn(null);
        setSortOrder(null);
      } else {
        setSortOrder("asc");
      }
    } else {
      setSortColumn(columnKey);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortOrder) {
      return data;
    }

    const column = columns.find((col) => col.accessor === sortColumn);
    if (!column) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortColumn as keyof T];
      const bValue = b[sortColumn as keyof T];

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

      return 0;
    });

    return sortOrder === "desc" ? sorted.reverse() : sorted;
  }, [data, sortColumn, sortOrder, columns]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function checkEmpty(value: any): string {
    return value !== null && value !== undefined && String(value).trim() !== ""
      ? String(value)
      : "---";
  }

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
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={`cursor-pointer font-semibold text-black ${column.headerClassName}`}
                onClick={() => handleSort(column)}
              >
                {column.header}{" "}
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
          {paginatedData.length ? (
            paginatedData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => {
                  const cellValue = row[column.accessor as keyof T];
                  return (
                    <TableCell key={colIndex} className={column.className}>
                      {column.Cell
                        ? column.Cell(cellValue, row)
                        : checkEmpty(cellValue)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="mt-4 flex items-center justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 ${
            currentPage === 1 ? "cursor-not-allowed opacity-50" : "" }`}
        >
          <ChevronLeftIcon />
        </button>

        <span className="px-3 py-2">
          Page {currentPage} of {totalPages}
        </span>

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
