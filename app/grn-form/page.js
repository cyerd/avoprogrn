import GRNForm from '@/components/GRNForm'
import { Suspense } from 'react';

export default function GRNFormPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Goods Received Note</h1>
      <Suspense>
      <GRNForm />
      </Suspense>
    </div>
  );
}