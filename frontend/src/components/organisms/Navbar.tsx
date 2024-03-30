import React from "react";
import { Appbar } from "@/components";

const Navbar = () => {
  /** Handles user sign out */
  const handleSignOut = (): void => {
    console.log("Handles sign out");
  };

  const navs = [
    { label: "Home", link: "/" },
    { label: "About", link: "/about" },
    { label: "Profile", link: "/users/asdf" },
  ];
  const actions = [{ label: "Log Out", onClick: handleSignOut }];

  return <Appbar navs={navs} actions={actions} />;
};

export default Navbar;
