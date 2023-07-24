'use client'

import CreditRequestGeneralReportGenerator from "@/app/components/credit-request/CreditRequestGeneralReportGenerator";
import CreditRequestTable from "@/app/components/credit-request/CreditRequestTable";
import CreateCreditRequest from "@/app/components/credit-request/CreateCreditRequest";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { listDepatureDetailByCampaignIdService } from "@/services/departure.detail.service";
import ErrorMessageModal from "@/app/components/credit-request/ErrorMessageModal"

export default function CreditRequest ({ params }: { params: { id: string }}) {

  const [toggleCreate, setToggleCreate] = useState(false)
  const [modalErrorMessageIsOpen, setModalErrorMessageIsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    listDepatureDetailByCampaignIdService({
      campaignId: params.id
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error.message)
        setErrorMessage(error.message)
      })
  }, [])

  return (
    <div className="mx-auto sm:px-6 lg:px-8">
      <ErrorMessageModal
      modalErrorMessageIsOpen={modalErrorMessageIsOpen}
      setModalErrorMessageIsOpen={setModalErrorMessageIsOpen}
      errorMessage={errorMessage}
      />
      <p className="text-2xl font-bold text-gray-100 p-6 text-center">{toggleCreate ? 'Crear una solicitud de credito para la campaña: ': 'Solicitudes de crédito para la campaña: '}{params.id}</p>
      <Button
        className="text-white mb-6 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
        onClick={() => {
          setToggleCreate(!toggleCreate)
          if(errorMessage !== '') {setModalErrorMessageIsOpen(true), setToggleCreate(false)} 
        }}
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
          ? <CreateCreditRequest campaignId={params.id} setToggleCreate={setToggleCreate}/>   
          : <CreditRequestTable campaignId={params.id}/>
      }
    </div>
  )
}