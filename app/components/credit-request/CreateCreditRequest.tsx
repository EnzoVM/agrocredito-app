"use client";

import { listAssistanceTypeService } from "@/services/assistance.type.service"
import { listDepatureDetailByCampaignIdService } from "@/services/departure.detail.service"
import { listTechnicalByAssistanceTypeService } from "@/services/technical.service"
import { Button } from "flowbite-react";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import FarmerListModal from "./FarmerListModal"
import { createCreditRequestService } from "@/services/credit.request.service";
import ErrorMessageModal from "./ErrorMessageModal"

export default function CreateCreditRequest ({
  campaignId, 
  setToggleCreate 
}:{ 
  campaignId: string, 
  setToggleCreate: Dispatch<SetStateAction<boolean>> 
}) {
  
  const [departureDetailList, setDepartureDetailList] = useState<{
    departureDetailId: number,
    deliveryPlanModelId: number,
    departureDetailDescription: string,
    departureType: string,
    resource: string,
    amountPerHectare: number
  }[]>([])

  const [assistanceTypeList, setAssistanceTypeList] = useState<{
    assistanceTypeId: number, 
    assistanceTypeDescription: string
  }[]>([])

  const [technicalList, setTechnicalList] = useState<{
    technicalId: number, 
    assistanceTypeDescription: string, 
    technicalName: string
  }[]>([])

  const [creditRequest, setCreditRequest] = useState<{
    farmerId: string,
    campaignId: string,
    hectareNumber: number,
    creditReason: string,
    creditAmount: number,
    guaranteeDescription: string,
    guaranteeAmount: number,
    technicalId: number,
    creditRequestObservation: string
  }>({
    farmerId: '',
    campaignId: '',
    hectareNumber: 0,
    creditReason: '',
    creditAmount: 0,
    guaranteeDescription: '',
    guaranteeAmount: 0,
    technicalId: 0,
    creditRequestObservation: ''
  })

  const [modalFormIsOpen, setModalFormIsOpen] = useState(false)
  const [modalErrorMessageIsOpen, setModalErrorMessageIsOpen] = useState(false)
  const [amountPerHectare, setAmountPerHectare] = useState(0)
  const [numberOfHectares, setNumberOfHectares] = useState(0)
  const [creditAmount, setCreditAmount] = useState('')
  const [farmer, setFarmer] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    listDepatureDetailByCampaignIdService({
      campaignId
    })
      .then(response => {
        setDepartureDetailList(response)
        console.log(response);
      })
      .catch(error => console.log(error.message))

    listAssistanceTypeService()
      .then(response => {
        setAssistanceTypeList(response)
        console.log(response)
      })
      .catch(error => console.log(error.message))
  }, [])

  const handleChangeTechnicalByAssistanceType = async (event: ChangeEvent<HTMLSelectElement>) => {
    const assistanceTypeId: number = Number(event.target.value)
    const technicalList = await listTechnicalByAssistanceTypeService({assistanceTypeId})
    setTechnicalList(technicalList)    
  }

  const handleChangeAmountPerHectare = (event: ChangeEvent<HTMLSelectElement>) => {
    const amountPerHectare: number = Number(event.target.value)
    setAmountPerHectare(Number(event.target.value))
    
    const creditAmount: number = numberOfHectares*amountPerHectare
    setCreditAmount(creditAmount.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' }))
    setCreditRequest({... creditRequest, creditAmount: Number(creditAmount.toFixed(2))})
  }

  const handleChangeCreditAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const hectareNumber: number = Number(event.target.value)
    setNumberOfHectares(hectareNumber)
    
    const creditAmount: number = hectareNumber*amountPerHectare
    setCreditAmount(creditAmount.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' }))
    setCreditRequest({... creditRequest, hectareNumber, creditAmount: Number(creditAmount.toFixed(2))})
  }
  
  const handleChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    if(
      event.target.name === 'guaranteeAmount' ||
      event.target.name === 'technicalId'
    ) {
      setCreditRequest({
        ... creditRequest,
        [event.target.name]: Number(event.target.value)
      })
    }else {
      setCreditRequest({
        ... creditRequest,
        [event.target.name]: event.target.value
      })
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    const creditRequestData = {... creditRequest, campaignId}

    createCreditRequestService(creditRequestData)
    .then(response => {
      console.log(response)
      setToggleCreate(false)
    })
    .catch(error => {
      console.log(error.message)
      setErrorMessage(error.message)
      setModalErrorMessageIsOpen(true)
    })
  }

  return (
    <>
      <FarmerListModal
      modalFormIsOpen={modalFormIsOpen} 
      setModalFormIsOpen={setModalFormIsOpen}
      creditRequest={creditRequest}
      setCreditRequest={setCreditRequest}
      setFarmer={setFarmer}
      />
      <ErrorMessageModal
      modalErrorMessageIsOpen={modalErrorMessageIsOpen}
      setModalErrorMessageIsOpen={setModalErrorMessageIsOpen}
      errorMessage={errorMessage}
      />
      <div className="mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between">
            <div className="block w-full mr-2 p-6 bg-white border border-gray-700 rounded-lg dark:bg-gray-800">
              <div className="flex justify-between">   
                <div className="mb-6 w-full mr-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo de partida:</label>
                  <select onChange={handleChangeAmountPerHectare} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                    <option value="">Elegir partida</option>
                    {
                      departureDetailList.map(departure => (
                        <option key={departure.departureDetailId} value={departure.amountPerHectare}>Partida - S/ {departure.amountPerHectare}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="mb-6 w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cantidad de hectareas:</label>
                  <input
                    type="number"
                    placeholder="Ingrese la cantidad de hectareas" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    name="hectareNumber"
                    onChange={handleChangeCreditAmount}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between">   
                <div className="mb-6 w-full mr-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Objeto del prestamo:</label>
                  <input
                    type="text"
                    placeholder="Ingrese el objeto del prestamo" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    name="creditReason"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-6 w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Monto del credito:</label>
                  <input
                    type="text"
                    placeholder="Monto del credito"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 cursor-not-allowed focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    name="creditAmount"
                    value={creditAmount}
                    disabled
                  />
                </div>
              </div>
              <div className="flex justify-between">   
                <div className="mb-6 w-full mr-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Garantia:</label>
                  <input
                    type="text"
                    placeholder="Ingrese la garantia" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    name="guaranteeDescription"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-6 w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Valor de garantia:</label>
                  <input
                    type="number"
                    placeholder="Ingrese el valor de la garantia" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    name="guaranteeAmount"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between">   
                <div className="mb-6 w-full mr-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo de asistencia tecnica:</label>
                  <select onChange={handleChangeTechnicalByAssistanceType} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                    <option value="">Elegir tipo</option>
                    {
                      assistanceTypeList.map(assistance => (
                        <option key={assistance.assistanceTypeId} value={assistance.assistanceTypeId}>{assistance.assistanceTypeDescription}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="mb-6 w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tecnico:</label>
                  <select name='technicalId' onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                    <option value="">Elegir tecnico</option>
                    {
                      technicalList.map(technical => (
                        <option key={technical.technicalId} value={technical.technicalId}>{technical.technicalName}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div className="flex justify-between">   
                <div className="mb-6 w-full mr-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Agricultor:</label>
                  <input
                    type="text"
                    placeholder="Seleccionar agricultor" 
                    className="mr-4 bg-gray-50 border border-gray-300 text-gray-900 cursor-not-allowed text-sm rounded-lg focus:ring-blue-500 w-4/5 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    disabled
                    value={farmer}
                    required
                  />
                  <Button
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                    onClick={() => setModalFormIsOpen(true)}
                  >
                    Seleccionar
                  </Button>
                </div>
                <div className="mb-6 w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Observaciones:</label>
                  <input
                    type="text"
                    placeholder="Ingrese observaciones" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    name="creditRequestObservation"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between">   
                <div className="w-full mr-4">
                <Button
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                  type="submit"
                >
                  Crear solicitud de credito
                </Button>
                </div>
              </div>
            </div>
          </div>    
        </form>
      </div>
    </>
  )
}