import React from "react";

export const Button = ({ onClick, children }) => (
  <button id="printPageButton"
    onClick={onClick}
    className="bg-blue-600 text-white px-4 py-2 rounded-2xl shadow hover:bg-blue-700"
  >
    {children}
  </button>
);