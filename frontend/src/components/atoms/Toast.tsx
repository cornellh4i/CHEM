import React, { ReactNode, useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface ToastProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  duration?: number; // in milliseconds
  type?: "success" | "error" | "warning" | "info"; // Optional type for custom styling
}

const getBackgroundColor = (type?: ToastProps["type"]) => {
  switch (type) {
    case "success":
      return "#D1FAE5"; // Light green for success
    case "error":
      return "#FECACA"; // Light red for error
    case "warning":
      return "#FEF3C7"; // Light yellow for warning
    case "info":
      return "#BFDBFE"; // Light blue for info
    default:
      return "#F3F4F6"; // Light gray for default/neutral
  }
};

const getTextColor = (type?: ToastProps["type"]) => {
  switch (type) {
    case "success":
      return "#065F46"; // Dark green for success
    case "error":
      return "#B91C1C"; // Dark red for error
    case "warning":
      return "#92400E"; // Dark yellow for warning
    case "info":
      return "#1E3A8A"; // Dark blue for info
    default:
      return "#000"; // Black for default/neutral
  }
};

const Toast = ({
  children,
  open,
  onClose,
  duration = 3000,
  type,
}: ToastProps) => {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    setVisible(open);
    if (open) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  return (
    <Snackbar
      open={visible}
      autoHideDuration={duration}
      onClose={onClose}
      TransitionComponent={(props: TransitionProps) => (
        <Slide {...props} direction="down" />
      )}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: getBackgroundColor(type), // Dynamic background based on type
          borderRadius: "8px",
          padding: "10px 16px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          maxWidth: "fit-content",
        }}
      >
        <span
          style={{ flexGrow: 1, color: getTextColor(type), fontSize: "14px" }}
        >
          {children}
        </span>
        <IconButton
          aria-label="close"
          size="small"
          onClick={onClose}
          style={{ color: getTextColor(type) }} // Dynamic icon color based on type
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    </Snackbar>
  );
};

export default Toast;
