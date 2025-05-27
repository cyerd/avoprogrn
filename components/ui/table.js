import React from "react";

export const Table = ({ children, className = "" }) => (
  <table className={`w-full border border-gray-300 text-sm text-left text-gray-700 ${className}`}>
    {children}
  </table>
);

export const Thead = ({ children, className = "" }) => (
  <thead className={`bg-gray-100 text-xs uppercase text-gray-600 border-b ${className}`}>
    {children}
  </thead>
);

export const Th = ({ children, className = "", ...props }) => (
  <th className={`px-4 py-2 border-r last:border-r-0 ${className}`} {...props}>
    {children}
  </th>
);

export const Tbody = ({ children, className = "" }) => (
  <tbody className={className}>{children}</tbody>
);

export const Tr = ({ children, className = "" }) => (
  <tr className={`border-b hover:bg-gray-50 ${className}`}>
    {children}
  </tr>
);

export const Td = ({ children, className = "", ...props }) => (
  <td className={`px-4 py-2 border-r last:border-r-0 ${className}`} {...props}>
    {children}
  </td>
);
