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
        style: { height: "40px" },
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleSearch} edge="end" size="small">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      size="small"
    />
  );
};

export default SearchBar;
