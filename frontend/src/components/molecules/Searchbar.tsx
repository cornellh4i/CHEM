import React, { useState } from "react";
import Input from "../../components/atoms/Input";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, IconButton, TextField } from "@mui/material";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  width?: string;
  style?: React.CSSProperties;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search for...",
  width = "300px",
  style,
}) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <TextField
      value={query}
      onChange={handleInputChange}
      placeholder={placeholder}
      variant="outlined"
      style={{
        width: width,
        ...style,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton onClick={handleSearch} edge="end" size="small">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: "40px",
          "& input": {
            color: "#000000", // Text color
          },
          "& fieldset": {
            borderColor: "#e5e7eb", // Default border
          },
          "&:hover fieldset": {
            borderColor: "#cbd5e1", // On hover
          },
          "&.Mui-focused fieldset": {
            borderColor: "#3b82f6", // On focus (e.g., blue-500)
          },
        },
      }}
    />
  );
};

export default SearchBar;
