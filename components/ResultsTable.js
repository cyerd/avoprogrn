"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ResultsTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/search-weighbridge?${searchParams.toString()}`);
        const { data } = await res.json();
        setData(data || []);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (searchParams.toString()) {
      fetchData();
    }
  }, [searchParams]);

  if (loading && searchParams.toString()) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!data.length && searchParams.toString()) {
    return <div className="text-center py-8">No results found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">WBT No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tare</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.WBT_No} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link 
                    href={`/grn-form?wbt=${item.WBT_No}`}
                    className="text-blue-600 hover:underline"
                  >
                    {item.WBT_No}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.WBT_Veh_Reg}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.SUP_Name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.ItemName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.WBT_1_Gross}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.WBT_1_Tare}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item['Net Weight']}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(item.WBT_Time_In).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/grn-form?wbt=${item.WBT_No}`}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Create GRN
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}