import React from "react";

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white shadow p-4 rounded-2xl ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`space-y-2 ${className}`}>{children}</div>
);
