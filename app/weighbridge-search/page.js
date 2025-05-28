import Pagination from "@/components/Pagination";
import ResultsTable from "@/components/ResultsTable";
import SearchForm from "@/components/SearchForm";
import { Suspense } from "react";


export default function WeighbridgeSearchPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Weighbridge Search</h1>
<<<<<<< HEAD
      <Suspense fallback={<div>Loading...</div>}>
=======
       <Suspense fallback={<div>Loading...</div>}>
>>>>>>> 411575f9f75249823fad597fac3c88993c889274
      <SearchForm />
      <ResultsTable />
      <Pagination />
      </Suspense>
    </div>
  );
}
