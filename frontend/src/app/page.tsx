import type { NextPage } from "next";
import Table from "@/components/atoms/Table";

const columns: Array<[string, "text" | "number" | "date"]> = [
  ["Name", "text"],
  ["Age", "number"],
  ["Date of Birth", "date"],
];

const data: Array<string[]> = [
  ["Alice", "30", "1993-05-12"],
  ["Bob", "25", "1998-07-08"],
  ["Charlie", "35", "1988-09-20"],
];

const Home: NextPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <h1 className="text-center text-6xl font-bold">CHEM</h1>
        <Table columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Home;
