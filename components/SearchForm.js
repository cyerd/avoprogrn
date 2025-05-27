'use client';

import { useEffect, useState } from 'react';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Link from 'next/link';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Africa/Nairobi');

export default function WeighbridgeSearchPage() {
  const MIN_SIZE = 10;
  const MAX_SIZE = 1000;

  const columns = [
    'WBT_No',
    'ItemName',
    'WBT_Trailer_No',
    'checkorderweight',
    'approvedby',
    'cus_name',
    'WBT_Time_Out',
    'WBT_Anpr_Veh_Reg',
    'WBT_Time_In',
    'WBT_Out',
    'WBT_Printed',
    'sup_name',
    'WBT_Veh_Reg',
    'SUP_Name',
    'SUP_Address1',
    'TRA_Name',
    'UserName',
    'Status',
    'Description',
    'WBT_Date',
    'WBT_Date_Out',
    'FAC_Name',
    'DriverName',
    'DnoteNo',
    'process',
    'WBT_1_Gross',
    'WBT_1_Tare',
    'Net Weight',
    'checkorderreason',
    'WBT_Operator'
  ];

  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [results, setResults] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('WBT_Time_In');
  const [sortDirection, setSortDirection] = useState('desc');
  const [visibleColumnCount, setVisibleColumnCount] = useState(20);
  const [selectedColumns, setSelectedColumns] = useState([
    'WBT_No',
    'ItemName',
    'WBT_Time_In',
    'WBT_Veh_Reg',
    'SUP_Name',
    'UserName',
    'Status',
    'WBT_Date_Out',
    'DriverName',
    'process',
    'WBT_1_Gross',
    'WBT_1_Tare',
    'Net Weight'
  ]);

  const visibleColumns = selectedColumns;

  useEffect(() => {
    search();
  }, []);

  useEffect(() => {
    paginateResults();
  }, [results, currentPage, sortColumn, sortDirection, visibleColumnCount]);

  const formatDate = (value) => {
    return value ? dayjs(value).tz('Africa/Nairobi').format('DD/MM/YYYY HH:mm') : '';
  };

  const search = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: query,
        sortColumn,
        sortDirection,
      });

      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await fetch(`/api/search-weighbridge?${params.toString()}`);
      const json = await res.json();
      setResults(json.data || []);
      setCurrentPage(1);
    } catch (err) {
      alert('Error loading weighbridge data');
      setResults([]);
    }
    setLoading(false);
  };

  const paginateResults = () => {
    let sorted = [...results];
    if (sortColumn) {
      sorted.sort((a, b) => {
        const valA = a[sortColumn] || '';
        const valB = b[sortColumn] || '';
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        } else {
          return sortDirection === 'asc'
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
        }
      });
    }
    const start = (currentPage - 1) * visibleColumnCount;
    setDisplayed(sorted.slice(start, start + visibleColumnCount));
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  const exportToExcel = () => {
    const dataToExport = results.map(row => {
      const filteredRow = {};
      visibleColumns.forEach(col => {
        filteredRow[col] = (col.includes('Date') || col.includes('Time')) ? formatDate(row[col]) : row[col];
      });
      return filteredRow;
    });

    const worksheet = utils.json_to_sheet(dataToExport);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Weighbridge');
    writeFile(workbook, 'weighbridge_data.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [visibleColumns],
      body: results.map(row => visibleColumns.map(col => (col.includes('Date') || col.includes('Time')) ? formatDate(row[col]) : row[col] || '')),
      styles: { fontSize: 6 },
      margin: { top: 10, bottom: 10 },
      headStyles: { fillColor: [52, 58, 64] },
    });
    doc.save('weighbridge_data.pdf');
  };

  const handleCheckboxChange = (col) => {
    setSelectedColumns(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const totalPages = Math.ceil(results.length / visibleColumnCount);

  return (
    <div className="p-4 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">🚛 Weighbridge Data</h1>

      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Search trailer, vehicle, customer..."
          className="border rounded px-3 py-2 w-full sm:w-64"
        />

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <label className="text-sm font-medium">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>

        <button
          onClick={search}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>

        <div>
          <label className="text-sm font-medium mr-2">Rows per page:</label>
          <input
            type="number"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={visibleColumnCount}
            onChange={(e) =>
              setVisibleColumnCount(Math.min(MAX_SIZE, Math.max(MIN_SIZE, Number(e.target.value))))
            }
            className="border px-2 py-1 rounded w-24"
          />
        </div>

        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export Excel
        </button>

        <button
          onClick={exportToPDF}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Export PDF
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-2">Select Columns to Display:</h2>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border rounded">
          {columns.map((col) => (
            <label key={col} className="text-xs whitespace-nowrap">
              <input
                type="checkbox"
                checked={selectedColumns.includes(col)}
                onChange={() => handleCheckboxChange(col)}
                className="mr-1"
              />
              {col}
            </label>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : displayed.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse w-full text-xs">
              <thead className="bg-gray-100">
                <tr>
                  {visibleColumns.map((col) => (
                    <th
                      key={col}
                      className="border p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort(col)}
                    >
                      <div className="flex items-center">
                        <span>{col}</span>
                        {sortColumn === col && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map((row, idx) => (
                  <tr key={row.WBT_No || idx} className="hover:bg-gray-50">
                    {visibleColumns.map((col) => (
                      <td key={col} className="border p-2 whitespace-nowrap">
                        {col === 'WBT_No' ? (
                          <Link
                            href={{
                              pathname: '/grn-form',
                              query: { 
                                wbt: row.WBT_No,
                                supplier: row.SUP_Name,
                                vehicle: row.WBT_Veh_Reg,
                                driver: row.DriverName,
                                item: row.ItemName,
                                gross: row.WBT_1_Gross,
                                tare: row.WBT_1_Tare,
                                net: (row.WBT_1_Gross - row.WBT_1_Tare) || 0
                              }
                            }}
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            {row[col]}
                          </Link>
                        ) : (col.includes('Date') || col.includes('Time')) ? (
                          formatDate(row[col])
                        ) : (
                          row[col]?.toString() ?? ''
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages} | Total Records: {results.length}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}