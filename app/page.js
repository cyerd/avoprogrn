import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Weighbridge System</h1>
        <div className="space-y-4">
          <Link
            href="/weighbridge-search"
            className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded hover:bg-blue-700 transition"
          >
            Search Weighbridge Data
          </Link>
          <Link
            href="/grn-form"
            className="block w-full bg-green-600 text-white text-center py-3 px-4 rounded hover:bg-green-700 transition"
          >
            Create New GRN
          </Link>
        </div>
      </div>
    </div>
  );
}