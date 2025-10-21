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

  // This watches what you type: it saves the text, clears results if you erase everything,
  // and waits 300ms after you stop typing before running the search.
  // This way, results update as you type without running a search on every keystroke.
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      onSearch(query.trim());
    }, 300);
  }, [query, onSearch]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setQuery(val);
    if (val.trim() === "") {
      onSearch("");
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      onSearch(val.trim());
    }, 300);
  };

  const handleSearch = () => {
    onSearch(query.trim());
  };

  return (
    <TextField
      value={query}
      onChange={handleInputChange}
      // When the user presses Enter inside the input field, trigger the search function
      // with the trimmed query text.
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSearch(query.trim());
        }
      }}

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
