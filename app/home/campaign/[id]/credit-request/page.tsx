'use client'

import CreditRequestGeneralReportGenerator from "@/app/components/credit-request/CreditRequestGeneralReportGenerator";
import CreditRequestTable from "@/app/components/credit-request/CreditRequestTable";
import CreateCreditRequest from "@/app/components/credit-request/CreateCreditRequest";
import { useEffect, useState } from "react";
import { listDepatureDetailByCampaignIdService } from "@/services/departure.detail.service";
import ErrorMessageModal from "@/app/components/credit-request/ErrorMessageModal"
import { createLogRecord } from "@/services/log.record.service";

export default function CreditRequest ({ params }: { params: { id: string }}) {

  const [toggleCreate, setToggleCreate] = useState(false)
  const [modalErrorMessageIsOpen, setModalErrorMessageIsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [recordId, setRecordId] = useState('')

  const buttonSelected = 'inline-flex items-center px-3 py-2 text-md font-normal text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 dark:text-white dark:focus:ring-gray-700'
  const buttonUnselected = 'inline-flex items-center px-3 py-2 text-md font-normal text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white dark:focus:ring-gray-700'

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
      setToggleCreate(true)
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
      <p className="text-2xl font-bold text-gray-100 p-6 text-center">
        {toggleCreate
          ? "Crear una solicitud de credito para la campaña: "
          : "Solicitudes de crédito para la campaña: "}
        {params.id}
      </p>
      <div className="mx-auto flex flex-row">
        <nav className="flex justify-between mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center mb-3 sm:mb-0">
            <li>
              <div className="flex items-center">
                <button
                  id="dropdownProject"
                  data-dropdown-toggle="dropdown-project"
                  className={toggleCreate ? buttonUnselected : buttonSelected}
                  onClick={() => {
                    setToggleCreate(false);
                  }}
                >
                  Listado de solicitudes
                </button>
              </div>
            </li>
            <span className="mx-2 text-gray-400">/</span>
            <li>
              <div className="flex items-center">
                <button
                  id="dropdownProject"
                  data-dropdown-toggle="dropdown-project"
                  className={toggleCreate ? buttonSelected : buttonUnselected}
                  onClick={onClickHandle}
                >
                  Crear solicitud
                </button>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      {toggleCreate ? (
        <CreateCreditRequest campaignId={params.id} setToggleCreate={setToggleCreate} recordId={recordId}/>
      ) : (
        <><CreditRequestGeneralReportGenerator campaignId={params.id} /> <CreditRequestTable campaignId={params.id}/></>
      )}
    </div>
  )
}