import React from "react";

export const Input = ({ label, ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-800">{label}</label>}
    <input
      {...props}
      className="border border-gray-300 text-black rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);