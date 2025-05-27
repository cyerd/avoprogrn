"use client"
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ItemsTable from './ItemsTable';

export default function GRNForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    'Supplier Name': '',
    'Supplier ID No': '',
    'Supplier Tel': '',
    'Supplier Address': '',
    'Driver Name': '',
    'Driver ID No': '',
    'Vehicle Reg No': ''
  });
  const [items, setItems] = useState([{ description: '', quantity: '', price: '', remarks: '' }]);
  const [receiver, setReceiver] = useState({ name: '', sign: '' });
  const [payee, setPayee] = useState({ name: '', sign: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeighbridgeData = async () => {
      const wbtNo = searchParams.get('wbt');
      if (!wbtNo) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/weighbridge/${wbtNo}`);
        const { data } = await res.json();
        
        setForm({
          'Supplier Name': data.SUP_Name || '',
          'Vehicle Reg No': data.WBT_Veh_Reg || '',
          'Driver Name': data.DriverName || '',
          'Operator': data.UserName || '',
          // Keep other fields as empty
          'Supplier ID No': '',
          'Supplier Tel': '',
          'Supplier Address': '',
          'Driver ID No': ''
        });

        setItems([{
          description: data.ItemName || '',
          quantity: data['Net Weight'] || '',
          price: '',
          remarks: `Gross: ${data.WBT_Net || 0}`
        }]);
      } catch (error) {
        console.error('Error fetching weighbridge data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeighbridgeData();
  }, [searchParams]);

  const handleFormChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/save-grn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form,
          items,
          receiver,
          payee,
          wbtNumber: searchParams.get('wbt')
        })
      });

      if (!response.ok) throw new Error('Failed to save GRN');
      alert('GRN saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save GRN');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading form data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Supplier & Vehicle Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(form).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">{key}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleFormChange(key, e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </div>
      </div>

      <ItemsTable items={items} setItems={setItems} />

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Signatures</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Receiver Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={receiver.name}
                  onChange={(e) => setReceiver({...receiver, name: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Signature</label>
                <input
                  type="text"
                  value={receiver.sign}
                  onChange={(e) => setReceiver({...receiver, sign: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Payee Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={payee.name}
                  onChange={(e) => setPayee({...payee, name: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Signature</label>
                <input
                  type="text"
                  value={payee.sign}
                  onChange={(e) => setPayee({...payee, sign: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Cancel
        </button>
        <button 
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save GRN
        </button>
      </div>
    </div>
  );
}