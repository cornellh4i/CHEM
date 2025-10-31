import React, { ReactNode } from "react";

interface ToastProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  variant?: "info" | "error";
}

const Toast = ({ children, open, onClose, variant = "info" }: ToastProps) => {
  if (!open) {
    return <></>;
  }

  return (
    <div className="fixed left-0 top-0 z-10 flex w-full p-4">
      <div
        id="toast-default"
        className={`mx-auto flex w-full max-w-md items-center rounded-lg p-4 shadow ${
          variant === "error"
            ? "border-red-700 bg-red-600 text-white border"
            : "bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400"
        }`}
        role="alert"
      >
        <div
          className={`inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
          variant === "error"
              ? "bg-red-700 text-white"
              : `bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200`
          }`}
        >
          <svg
            className="h-4 w-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"
            />
          </svg>
          <span className="sr-only">Fire icon</span>
        </div>
        <div className="mr-5 ms-3 text-sm font-normal">{children}</div>
        <button
          type="button"
          className={`-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg p-1.5 focus:ring-2 ${
            variant === "error"
              ? `bg-red-600 text-white hover:bg-red-700 hover:text-white focus:ring-red-300`
              : `bg-white text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white`
          }`}
          data-dismiss-target="#toast-default"
          aria-label="Close"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <svg
            className="h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
