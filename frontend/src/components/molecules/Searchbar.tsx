import React, { useState } from "react";
import Input from "../../components/atoms/Input";
import SearchIcon from "@mui/icons-material/Search";
import Button from "../../components/atoms/Button";
import { InputAdornment, IconButton } from "@mui/material";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  width?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search for...",
  width = "100%",
}) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <Input
      value={query}
      onChange={handleInputChange}
      placeholder={placeholder}
      width={width}
      endAdornment={
        <InputAdornment position="end">
          <IconButton onClick={handleSearch} edge="end">
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      }
    />
  );
};

export default SearchBar;
