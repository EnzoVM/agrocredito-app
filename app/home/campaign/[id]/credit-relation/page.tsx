"use client";

import CreditRelationTable from "@/app/components/credit-relation/CreditRelationTable";

export default function CreditRelations ({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto sm:px-6 lg:px-8">
      <p className="text-2xl font-bold text-gray-100 p-6 text-center">
        Relación de créditos para la campaña: {params.id}
      </p>
      <CreditRelationTable campaignId={params.id} />
    </div>
  );
}
