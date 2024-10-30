import * as React from "react";
import { SimpleTable, Column } from "@/components/molecules/SimpleTable";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const DummyTable = () => {
  const PAGE_SIZE = 5;
  type TableData = {
    fund: string;
    date: string;
    type: string;
    units: number;
    amount: number;
    restriction?: string;
    contributor?: string;
    documentLink?: string;
  };

  const activityData: TableData[] = [
    {
      date: "01/15/2024",
      contributor: "Alice Smith",
      fund: "Education Fund",
      type: "Donation",
      documentLink: "https://example.com/doc1",
      units: 10,
      amount: -5000.0,
    },
    {
      date: "02/20/2024",
      contributor: "Bob Johnson",
      fund: "Health Fund",
      type: "Grant",
      documentLink: "https://example.com/doc2",
      units: 5,
      amount: 7500.0,
    },
    {
      date: "03/10/2024",
      contributor: "Carol Williams",
      fund: "Research Fund",
      type: "Endowment",
      documentLink: "https://example.com/doc3",
      units: 15,
      amount: 15000.0,
    },
    {
      date: "04/05/2024",
      contributor: "David Brown",
      fund: "Community Fund",
      type: "Donation",
      units: 8,
      amount: 8000.0,
    },
    {
      date: "05/25/2024",
      contributor: "Emma Davis",
      fund: "Arts Fund",
      type: "Grant",
      documentLink: "https://example.com/doc4",
      units: 12,
      amount: -12000.0,
    },
    {
      date: "06/30/2024",
      contributor: "Frank Miller",
      fund: "Science Fund",
      type: "Endowment",
      units: 6,
      amount: 6000.0,
    },
    {
      date: "07/14/2024",
      contributor: "Grace Wilson",
      fund: "Technology Fund",
      type: "Donation",
      documentLink: "https://example.com/doc5",
      units: 9,
      amount: 9000.0,
    },
    {
      date: "08/22/2024",
      contributor: "Henry Moore",
      fund: "Innovation Fund",
      type: "Grant",
      units: 11,
      amount: -11000.0,
    },
    {
      date: "09/05/2024",
      contributor: "Isabella Taylor",
      fund: "Development Fund",
      type: "Endowment",
      documentLink: "https://example.com/doc6",
      units: 7,
      amount: -7000.0,
    },
    {
      date: "10/18/2024",
      contributor: "Jack Anderson",
      fund: "Environmental Fund",
      type: "Donation",
      units: 13,
      amount: 13000.0,
    },
  ];

  const activityColumns: Column<TableData>[] = [
    {
      header: "Date",
      accessor: "date",
      dataType: "date",
      sortable: true,
    },
    {
      header: "Contributor",
      accessor: "contributor",
      dataType: "string",
      sortable: true,
    },
    {
      header: "Fund",
      accessor: "fund",
      dataType: "string",
      sortable: true,
    },
    {
      header: "Type",
      accessor: "type",
      dataType: "string",
      sortable: true,
    },
    {
      header: "Documents",
      accessor: "documentLink",
      dataType: "string",
      sortable: false,
      Cell: (value) =>
        value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-gray-500 underline"
          >
            <span>Open documents</span>
            <OpenInNewIcon className="inline h-3.5 w-3.5" />
          </a>
        ) : (
          "---"
        ),
    },
    {
      header: "Units",
      accessor: "units",
      dataType: "number",
      sortable: true,
    },
    {
      header: "Amount",
      accessor: "amount",
      dataType: "number",
      sortable: true,
      headerClassName: "text-right",
      className: "text-right font-medium",
      Cell: (value) => (
        <span style={{ color: value > 0 ? "green" : "red" }}>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(value)}
        </span>
      ),
    },
  ];

  return (
    <div>
      <SimpleTable<TableData>
        data={activityData}
        columns={activityColumns}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
};
export default DummyTable;
