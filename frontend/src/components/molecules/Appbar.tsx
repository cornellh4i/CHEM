import React from "react";
import Button from "../atoms/Button";

interface AppbarProps {
  /** List of nav labels and links in order of display */
  navs: { label: string; link: string }[];
  /** List of action labels and actions in order of display */
  actions: { label: string; onClick: () => void }[];
}

const Appbar = ({ navs, actions }: AppbarProps) => {
  return (
    <div>
      {/* Nav items */}
      {navs.map((nav, index) => (
        <div key={index}>
          <a href={nav.link}>{nav.label}</a>
        </div>
      ))}

      {/* Action items */}
      {actions.map((action, index) => (
        <div key={index}>
          <Button onClick={action.onClick}>{action.label}</Button>
        </div>
      ))}
    </div>
  );
};

export default Appbar;
