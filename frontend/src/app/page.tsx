"use client";

import type { NextPage } from "next";
import { SimpleTable, Column } from "@/components/atoms/SimpleTable";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

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

const fundsData: TableData[] = [
  {
    date: "01/10/2024",
    contributor: "---",
    fund: "Education Fund",
    type: "Endowment",
    units: 1000,
    amount: 500000.0,
    restriction: "Restricted",
  },
  {
    date: "02/15/2024",
    contributor: "---",
    fund: "Health Fund",
    type: "Endowment",
    units: 800,
    amount: 400000.0,
    restriction: "Unrestricted",
  },
  {
    date: "03/20/2024",
    contributor: "---",
    fund: "Research Fund",
    type: "Endowment",
    units: 1200,
    amount: 600000.0,
    restriction: "Restricted",
  },
  {
    date: "04/25/2024",
    contributor: "---",
    fund: "Community Fund",
    type: "Endowment",
    units: 950,
    amount: 475000.0,
    restriction: "Unrestricted",
  },
  {
    date: "05/30/2024",
    contributor: "---",
    fund: "Arts Fund",
    type: "Endowment",
    units: 1100,
    amount: 550000.0,
    restriction: "Restricted",
  },
  {
    date: "06/05/2024",
    contributor: "---",
    fund: "Science Fund",
    type: "Endowment",
    units: 1050,
    amount: 525000.0,
    restriction: "Unrestricted",
  },
  {
    date: "07/12/2024",
    contributor: "---",
    fund: "Technology Fund",
    type: "Endowment",
    units: 1150,
    amount: 575000.0,
    restriction: "Restricted",
  },
  {
    date: "08/18/2024",
    contributor: "---",
    fund: "Innovation Fund",
    type: "Endowment",
    units: 900,
    amount: 450000.0,
    restriction: "Unrestricted",
  },
  {
    date: "09/23/2024",
    contributor: "---",
    fund: "Development Fund",
    type: "Endowment",
    units: 1300,
    amount: 650000.0,
    restriction: "Restricted",
  },
  {
    date: "10/28/2024",
    contributor: "---",
    fund: "Environmental Fund",
    type: "Endowment",
    units: 1250,
    amount: 625000.0,
    restriction: "Unrestricted",
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

const fundsColumns: Column<TableData>[] = [
  {
    header: "Fund",
    accessor: "fund",
    dataType: "string",
    sortable: true,
  },
  {
    header: "Date Added",
    accessor: "date",
    dataType: "date",
    sortable: true,
  },
  {
    header: "Type",
    accessor: "type",
    dataType: "string",
    sortable: true,
  },
  {
    header: "Restriction",
    accessor: "restriction",
    dataType: "string",
    sortable: true,
    Cell: (value) => (
      <span className="rounded-full bg-gray-300 px-3 py-1.5 text-black">
        {value}
      </span>
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
      <span>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value)}
      </span>
    ),
  },
];

const PAGE_SIZE = 5;

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-12 py-10">
      <div className="w-full max-w-6xl">
        <h2 className="mb-4 text-xl font-semibold">Activity Table</h2>
        <SimpleTable<TableData>
          data={activityData}
          columns={activityColumns}
          pageSize={PAGE_SIZE}
        />
      </div>

      <div className="w-full max-w-6xl">
        <h2 className="mb-4 text-xl font-semibold">Funds Table</h2>
        <SimpleTable<TableData>
          data={fundsData}
          columns={fundsColumns}
          pageSize={PAGE_SIZE}
        />
      </div>
    </div>
  );
};

export default Home;
