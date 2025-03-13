"use client";

import { useState } from "react";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import ContributorsTable from "@/components/molecules/ContributorsTable";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import LaunchIcon from "@mui/icons-material/Launch";
import { OutlinedInput, InputAdornment, Box, Typography } from "@mui/material";
import Button from "@/components/atoms/Button";
import AddContributorModal from "@/components/molecules/AddContributorModal";

const ContributorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
      <ContributorsTable />
    </DashboardTemplate>
  );
};

export default ContributorsPage;
