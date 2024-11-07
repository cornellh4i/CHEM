import React, { useState } from "react";
import Input from "../../components/atoms/Input"; // Assuming this is a styled TextField component or similar
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, IconButton, TextField } from "@mui/material";

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    width?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    placeholder = "Search for...",
    width = "300px",
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
            }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handleSearch} edge="end">
                            <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default SearchBar;
