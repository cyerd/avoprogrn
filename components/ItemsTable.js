"use client"
import { useState } from 'react';

export default function ItemsTable({ items, setItems }) {
  const addItem = () => {
    setItems([...items, { description: '', quantity: '', price: '', remarks: '' }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + (quantity * price);
    }, 0);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Items</h2>
        <button
          onClick={addItem}
          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
        >
          Add Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={item.remarks}
                    onChange={(e) => updateItem(index, 'remarks', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  {(parseFloat(item.quantity) * parseFloat(item.price) || 0)}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => removeItem(index)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-right font-bold">
        Total: {calculateTotal().toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}
      </div>
    </div>
  );
}