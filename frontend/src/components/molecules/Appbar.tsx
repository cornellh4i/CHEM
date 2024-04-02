import React, { useState } from "react";
import Link from "next/link";

interface AppbarProps {
  /** List of nav labels and links in order of display */
  navs?: { label: string; link: string }[];
  /** List of action labels and actions in order of display */
  actions?: { label: string; onClick: () => void }[];
}

const Appbar = ({ navs, actions }: AppbarProps) => {
  /** Handles clicking the hamburger menu */
  const onClick = (): void => {
    setOpen(!open);
  };

  const [open, setOpen] = useState(false);
  const styles = open ? "" : "hidden";

  return (
    <nav
      className="border-b border-gray-200 bg-white dark:border-gray-800
        dark:bg-gray-900"
    >
      <div
        className="mx-auto flex max-w-screen-xl flex-wrap items-center
          justify-between p-4"
      >
        <a
          href="https://flowbite.com/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span
            className="self-center whitespace-nowrap text-2xl font-semibold
              dark:text-gray-300"
          >
            Flowbite
          </span>
        </a>
        <button
          type="button"
          className="inline-flex h-8 w-10 items-center justify-center rounded-lg
            p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none
            focus:ring-2 focus:ring-gray-200 md:hidden dark:text-gray-400
            dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          onClick={onClick}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className={`${styles} w-full md:block md:w-auto`}>
          <ul
            className="mt-4 flex flex-col rounded-lg border border-gray-100
              bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-8
              md:border-0 md:bg-white md:p-0 rtl:space-x-reverse
              dark:border-gray-700 dark:bg-gray-800 md:dark:bg-gray-900"
          >
            {/* Nav items */}
            {navs?.map((nav, index) => (
              <li key={index}>
                <Link
                  href={nav.link}
                  className="block rounded px-3 py-2 text-gray-900
                    hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent
                    md:hover:text-blue-700 dark:text-gray-300
                    dark:hover:bg-gray-700 dark:hover:text-white
                    md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
                >
                  {nav.label}
                </Link>
              </li>
            ))}

            {/* Action items */}
            {actions?.map((action, index) => (
              <li key={index}>
                <div
                  onClick={action.onClick}
                  className="block cursor-pointer rounded px-3 py-2
                    text-gray-900 hover:bg-gray-100 md:border-0 md:p-0
                    md:hover:bg-transparent md:hover:text-blue-700
                    dark:text-gray-300 dark:hover:bg-gray-700
                    dark:hover:text-white md:dark:hover:bg-transparent
                    md:dark:hover:text-blue-500"
                >
                  {action.label}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Appbar;
