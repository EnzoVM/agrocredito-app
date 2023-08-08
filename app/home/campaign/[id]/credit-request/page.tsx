'use client'

import CreditRequestGeneralReportGenerator from "@/app/components/credit-request/CreditRequestGeneralReportGenerator";
import CreditRequestTable from "@/app/components/credit-request/CreditRequestTable";
import CreateCreditRequest from "@/app/components/credit-request/CreateCreditRequest";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { listDepatureDetailByCampaignIdService } from "@/services/departure.detail.service";
import ErrorMessageModal from "@/app/components/credit-request/ErrorMessageModal"
import { createLogRecord } from "@/services/log.record.service";

export default function CreditRequest ({ params }: { params: { id: string }}) {

  const [toggleCreate, setToggleCreate] = useState(false)
  const [modalErrorMessageIsOpen, setModalErrorMessageIsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [recordId, setRecordId] = useState('')

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
  
  const onClickHandle = async () => {
    if(errorMessage !== '') {
      setModalErrorMessageIsOpen(true), 
      setToggleCreate(false)
    } else {
      setToggleCreate(!toggleCreate)
      const initRequestTime = new Date()
      const { recordId } = await createLogRecord({
        resource: 'create-credit-request',
        method: 'POST',
        initRequestTime
      })
      setRecordId(recordId)
    }
  }

  return (
    <div className="mx-auto sm:px-6 lg:px-8">
      <ErrorMessageModal
      modalErrorMessageIsOpen={modalErrorMessageIsOpen}
      setModalErrorMessageIsOpen={setModalErrorMessageIsOpen}
      errorMessage={errorMessage}
      />
      <p className="text-2xl font-bold text-gray-100 p-6 text-center">{toggleCreate ? 'Crear una solicitud de credito para la campaña: ': 'Solicitudes de crédito para la campaña: '}{params.id}</p>
      <div className="flex flex-row">
        <Button
          className="text-white mb-6 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
          onClick={onClickHandle}
        >
          {
            toggleCreate
              ? 'Cancelar'
              : 'Crear solicitud de crédito'
          }
        </Button>
        {
          toggleCreate
            ? <></>
            : <CreditRequestGeneralReportGenerator campaignId={params.id} />
        }
      </div>
      {
        toggleCreate
          ? <CreateCreditRequest campaignId={params.id} setToggleCreate={setToggleCreate} recordId={recordId}/>   
          : <CreditRequestTable campaignId={params.id}/>
      }
    </div>
  )
}