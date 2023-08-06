import { createCampaignService } from "@/services/campaign.service";
import { listCampaignTypeService } from "@/services/campaign.type.service";
import { Button, Modal } from "flowbite-react";
import React, { Dispatch, SetStateAction } from "react";
import { FormEvent, useEffect, useState } from "react";

interface Props {
  modalFormIsOpen: boolean
  setModalFormIsOpen: (modalFormIsOpen: boolean) => void
  setPaginationSelected: Dispatch<SetStateAction<number>>
  setFilters: Dispatch<SetStateAction<{
    filter: string;
    page: number;
    limit: number;
    typeSearch: 'code' | 'all' | 'year'}>>
  setPaginationNumbers: Dispatch<SetStateAction<number[]>>
}

export default function CreateCampaignModal ({ modalFormIsOpen, setModalFormIsOpen, setPaginationSelected, setFilters, setPaginationNumbers}: Props) {

  const [campaignTypeList, setCampaignTypeList] = useState<{
    campaignTypeId: number;
    campaignTypeDescription: string;
    periodQuantity: number;
  }[]>([])

  const [authFailed, setAuthFailed] = useState('')
  
  const campaignDescriptionValue = React.useRef(null)
  const campaignTypeIdValue = React.useRef(null)
  const campaignInterestValue = React.useRef(null)
  const campaignDelinquentInterestValue = React.useRef(null)
  const startDateValue = React.useRef(null)
  const finishDateValue = React.useRef(null)

  useEffect(() => {
    listCampaignTypeService()
    .then(response => {
      setCampaignTypeList(response)      
    })
    .catch(error => console.log(error))
  }, [])

  const clearInputFields = () => {
    //@ts-ignore
    campaignDescriptionValue.current.value=''
    //@ts-ignore
    campaignTypeIdValue.current.value=''
    //@ts-ignore
    campaignInterestValue.current.value=''
    //@ts-ignore
    campaignDelinquentInterestValue.current.value=''
    //@ts-ignore
    startDateValue.current.value=''
    //@ts-ignore
    finishDateValue.current.value=''
  }

  const getValueInputs = () => {
    //@ts-ignore
    const [startYear, startMonth, startDay] = (startDateValue.current?.value).split('-')
    //@ts-ignore
    const [finishYear, finishMonth, finishDay] = (finishDateValue.current?.value).split('-')

    return {
      //@ts-ignore
      campaignDescription: campaignDescriptionValue.current?.value,
      //@ts-ignore
      campaignTypeId: campaignTypeIdValue.current?.value,
      //@ts-ignore
      campaignInterest: campaignInterestValue.current?.value,
      //@ts-ignore
      campaignDelinquentInterest: campaignDelinquentInterestValue.current?.value,
      startDate: startDay+"/"+startMonth,
      finishDate: finishDay+"/"+finishMonth,
      startYear: startYear,
      finishYear: finishYear
    }
  }

  const handleCancel = () => {
    setAuthFailed('')
    clearInputFields()
    setModalFormIsOpen(false)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthFailed('')
    const campaignData = getValueInputs()
    
    if(campaignData.startYear !== campaignData.finishYear){
      setAuthFailed('El año de la fecha de inicio debe de ser igual al de la fecha final')
      return 
    }
    
    createCampaignService({
      campaignDescription: String(campaignData.campaignDescription),
      campaignTypeId: Number(campaignData.campaignTypeId),
      campaignYear: String(campaignData.startYear),
      startDate: String(campaignData.startDate),
      finishDate: String(campaignData.finishDate),
      campaignInterest: Number(campaignData.campaignInterest),
      campaignDelinquentInterest: Number(campaignData.campaignDelinquentInterest)
    })
    .then(response => {
      console.log(response)
      clearInputFields()
      setFilters({filter: '', page: 1, limit: 8, typeSearch: 'all'})
      setPaginationSelected(1)
      setPaginationNumbers([1,2,3,4,5])
      setModalFormIsOpen(false)
    })
    .catch(error => {
      console.log(error.message)
      setAuthFailed(error.message)
    })
  }


  return (
    <Modal show={modalFormIsOpen} onClose={() => handleCancel()}>
      <form onSubmit={handleSubmit}>
        <Modal.Header className="border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          Creación de campaña
        </Modal.Header>
        <Modal.Body className="border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800" >
        {
          authFailed !== ''
            ? <div className="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Info</span>
                <div>
                  <span className="font-medium">Algo salió mal!</span> {authFailed}
                </div>
              </div>
            : <></>
        }
          <div className="flex justify-between">  
            <div className="mb-6 w-full mr-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripcion de la campaña</label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Ingrese la descripción de la campaña"
                ref={campaignDescriptionValue}
                required
              />
            </div>
            <div className="mb-6 w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo de campaña</label>
              <select  ref={campaignTypeIdValue} name="campaignTypeId" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="">Elegir tipo</option>
                {
                  campaignTypeList.map(campaignType => (
                    <option key={campaignType.campaignTypeId} value={campaignType.campaignTypeId}>{campaignType.campaignTypeDescription}</option>
                  ))
                } 
              </select>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="mb-6 w-full mr-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Interes (%) de la campaña</label>
              <input
                type="number"
                placeholder="Ingrese el interes de la campaña" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                ref={campaignInterestValue}
                step="0.01"
                required
              />
            </div>
            <div className="mb-6 w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Interes Moroso (%) de la campaña</label>
              <input
                type="number"
                placeholder="Ingrese el interes de la campaña" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                ref={campaignDelinquentInterestValue}
                step="0.01"
                required
              />
            </div>
          </div>
          <div className="flex justify-between">   
            <div className="w-full mr-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha de inicio del periodo</label>
              <input
                type="date"
                placeholder="Ingrese el año de la campaña" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                ref={startDateValue}
                required
              />
            </div>
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha fin del periodo</label>
              <input
                type="date"
                placeholder="Ingrese el año de la campaña" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                ref={finishDateValue}
                required
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <Button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
            type="submit"
          >
            Crear campaña
          </Button>
          <Button
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}