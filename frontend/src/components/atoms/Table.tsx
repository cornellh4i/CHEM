import React from "react";

interface TableProps {
  columns: Array<[string, "text" | "number" | "date"]>;
  data: Array<string[]>;
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
  // Render the custom table without using any external library
  return (
    <div
      style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "4px" }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        {/* Create the header row dynamically based on the columns prop */}
        <thead>
          <tr>
            {columns.map(([label], index) => (
              <th
                key={index}
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        {/* Create the table body dynamically based on the data prop */}
        <tbody>
          {data.map((rowData, rowIndex) => (
            <tr key={rowIndex}>
              {rowData.map((cellData, cellIndex) => (
                <td
                  key={cellIndex}
                  style={{ borderBottom: "1px solid #ddd", padding: "8px" }}
                >
                  {cellData}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
