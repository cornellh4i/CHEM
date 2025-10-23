import React from "react";
import { Appbar } from "@/components";
import { signOut } from "firebase/auth";
import auth from "../../utils/firebase-client";

const Navbar = () => {
  /** Handles user sign out */
  const handleSignOut = async (): Promise<void> => {
    await signOut(auth)
      .then(() => {
        // sign-out successful
        console.log("User signed out successfully");
        window.location.href = "/login";
      })
      .catch((error) => {
        // error
        console.error("Error signing out:", error);
      });
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
