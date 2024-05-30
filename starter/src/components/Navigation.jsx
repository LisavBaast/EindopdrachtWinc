import React from "react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Back to events</Link>
        </li>
      </ul>
    </nav>
  );
};
