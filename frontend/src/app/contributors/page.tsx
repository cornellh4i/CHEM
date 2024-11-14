"use client";

import { useState } from "react";
import { SimpleTable, Column } from "@/components/molecules/SimpleTable";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import LaunchIcon from "@mui/icons-material/Launch";
import { OutlinedInput, InputAdornment, Box, Typography } from "@mui/material";
import Button from "@/components/atoms/Button";
import AddContributorModal from "@/components/molecules/AddContributorModal";

const ContributorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const contributorData = [
    { name: "Jason Zheng", recentActivity: "04/05/2024", amount: 343.23 },
    { name: "Diego Marques", recentActivity: "04/01/2024", amount: 200.0 },
    { name: "Mohammad Kane", recentActivity: "12/25/2024", amount: 1508.97 },
  ];

  const columns: Column<(typeof contributorData)[0]>[] = [
    {
      header: "Name",
      accessor: "name",
      dataType: "string",
      sortable: true,
    },
    {
      header: "Recent Activity",
      accessor: "recentActivity",
      dataType: "date",
      sortable: true,
    },
    {
      header: "Amount",
      accessor: "amount",
      dataType: "number",
      sortable: true,
      Cell: (value) => (
        <span style={{ color: value > 0 ? "green" : "red" }}>
          {value > 0
            ? `+$${value.toFixed(2)}`
            : `-$${Math.abs(value).toFixed(2)}`}
        </span>
      ),
    },
  ];

  return (
    <DashboardTemplate>
      <Typography variant="h4" gutterBottom>
        Contributors
      </Typography>
      {/* Search Bar */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        {/* Search Bar */}
        <Box
          className="rounded-2xl"
          display="flex"
          alignItems="center"
          width={{ xs: "100%", sm: "50%" }}
          marginBottom={{ xs: 2, sm: 0 }}
        >
          <OutlinedInput
            placeholder="Find a contributor..."
            fullWidth
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
            style={{ borderRadius: "10px", height: "40px" }}
          />
        </Box>

        {/* Action Buttons */}
        <Box
          display="flex"
          gap={2}
          alignItems="center"
          justifyContent={{ xs: "flex-start", sm: "flex-end" }}
          width={{ xs: "100%", sm: "auto" }}
          flexWrap="wrap"
        >
          <AddContributorModal>
            <Button
              variant="primary"
              style={{
                display: "flex",
                alignItems: "center",
                height: "40px",
                padding: "0 16px",
                marginBottom: 8,
              }}
            >
              Add Contributor
              <AddIcon style={{ marginLeft: "6px" }} />
            </Button>
          </AddContributorModal>

          <Button
            variant="primary"
            style={{
              display: "flex",
              alignItems: "center",
              height: "40px",
              padding: "0 16px",
              marginBottom: 8,
            }}
          >
            Export
            <LaunchIcon style={{ marginLeft: "6px" }} />
          </Button>
        </Box>
      </Box>

      <SimpleTable data={contributorData} columns={columns} pageSize={5} />
    </DashboardTemplate>
  );
};

export default ContributorsPage;
