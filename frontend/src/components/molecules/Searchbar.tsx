// frontend/src/components/molecules/Searchbar.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

export interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  width?: string;
  style?: React.CSSProperties;
  debounceMs?: number;
  emitOnType?: boolean;

  // Optional: have the component fetch results itself
  endpoint?: string; // e.g. "/api/search/funds"
  onResults?: (results: unknown) => void;
  mapResponse?: (json: any) => unknown;
}

const Searchbar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search…",
  width = "300px",
  style,
  debounceMs = 250,
  emitOnType = true,
  endpoint,
  onResults,
  mapResponse,
}) => {
  const [query, setQuery] = useState("");

  // In browsers, setTimeout returns a number. Use null when not set.
  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchResults = async (q: string) => {
    if (!endpoint) return;
    // cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    const controller = new AbortController();
    abortRef.current = controller;

    const url = new URL(endpoint, window.location.origin);
    url.searchParams.set("q", q);

    const res = await fetch(url.toString(), { signal: controller.signal });
    const json = await res.json();
    onResults?.(mapResponse ? mapResponse(json) : json);
  };

  // Typing behavior: emit while typing (debounced) if enabled
  useEffect(() => {
    if (!emitOnType) return; // allowed to return undefined

    // clear previous timer
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = window.setTimeout(() => {
      onSearch?.(query);
      if (endpoint) void fetchResults(query);
    }, debounceMs);

    // ✅ cleanup returns void; never returns a number
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [query, emitOnType, debounceMs, onSearch, endpoint]);

  const triggerNow = async () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onSearch?.(query);
    if (endpoint) await fetchResults(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch?.("");
    if (endpoint) onResults?.([]);
  };

  return (
    <TextField
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          void triggerNow();
        }
      }}
      placeholder={placeholder}
      variant="outlined"
      style={{ width, ...style }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton
              aria-label="search"
              onClick={() => void triggerNow()}
              edge="start"
              size="small"
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: query ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="clear"
              onClick={handleClear}
              edge="end"
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: "40px",
          "& input": { color: "#000000" },
          "& fieldset": { borderColor: "#e5e7eb" },
          "&:hover fieldset": { borderColor: "#cbd5e1" },
          "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
        },
      }}
    />
  );
};

export default Searchbar;
