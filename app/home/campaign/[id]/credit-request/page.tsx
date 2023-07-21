'use client'

import CreditRequestGeneralReportGenerator from "@/app/components/credit-request/CreditRequestGeneralReportGenerator";
import CreditRequestTable from "@/app/components/credit-request/CreditRequestTable";
import { Button } from "flowbite-react";
import { useState } from "react";

export default function CreditRequest ({ params }: { params: { id: string }}) {

  const [toggleCreate, setToggleCreate] = useState(false)

  return (
    <div className="mx-auto sm:px-6 lg:px-8">
      <p className="text-2xl font-bold text-gray-100 p-6 text-center">Solicitudes de crédito para la campaña: {params.id}</p>
      <Button
        className="text-white mb-6 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
        onClick={() => setToggleCreate(!toggleCreate)}
      >
        {
        toggleCreate
          ? 'Cancelar'
          : 'Crear solicitud de crédito'
        }
      </Button>
      <CreditRequestGeneralReportGenerator campaignId={params.id} />
      {
        toggleCreate
          ? <></> 
          : <CreditRequestTable campaignId={params.id} />
      }
    </div>
  )
}