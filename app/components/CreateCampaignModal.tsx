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
  const campaignYearValue = React.useRef(null)
  const startDayValue = React.useRef(null)
  const startMonthValue = React.useRef(null)
  const finishDayValue = React.useRef(null)
  const finishMonthValue = React.useRef(null)

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
    campaignYearValue.current.value=''
    //@ts-ignore
    startDayValue.current.value=''
    //@ts-ignore
    startMonthValue.current.value=''
    //@ts-ignore
    finishDayValue.current.value=''
    //@ts-ignore
    finishMonthValue.current.value=''
  }

  const getValueInputs = () => {
    return {
      //@ts-ignore
      campaignDescription: campaignDescriptionValue.current?.value,
      //@ts-ignore
      campaignTypeId: campaignTypeIdValue.current?.value,
      //@ts-ignore
      campaignYear: campaignYearValue.current?.value,
      //@ts-ignore
      startDate: startDayValue.current?.value+"/"+startMonthValue.current?.value,
      //@ts-ignore
      finishDate: finishDayValue.current?.value+"/"+finishMonthValue.current?.value
    }
  }

  const handleCancel = () => {
    setAuthFailed('')
    clearInputFields()
    setModalFormIsOpen(false)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const campaignData = getValueInputs()
    setAuthFailed('')

    createCampaignService({
      campaignDescription: String(campaignData.campaignDescription),
      campaignTypeId: Number(campaignData.campaignTypeId),
      campaignYear: String(campaignData.campaignYear),
      startDate: String(campaignData.startDate),
      finishDate: String(campaignData.finishDate)
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
    <Modal show={modalFormIsOpen} onClose={() => setModalFormIsOpen(false)}>
      <form onSubmit={handleSubmit}>
        <Modal.Header className="border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          Creación de campaña
        </Modal.Header>
        <Modal.Body className="border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800" >
        {
          authFailed !== ''
            ? <div className="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                <span className="sr-only">Info</span>
                <div>
                  <span className="font-medium">Algo salió mal!</span> Hay un error con las fechas de inicio y fin.
                </div>
              </div>
            : <></>
        }   
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripcion de la campaña</label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="Ingrese la descripción de la campaña"
              ref={campaignDescriptionValue}
              required
            />
          </div>
          <div className="mb-6">
            <div className="flex justify-around">   
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo de campaña</label>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Año de la campaña</label>
            </div>  
            <div className="flex justify-between">
              <select  ref={campaignTypeIdValue} name="campaignTypeId" className="w-1/2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="">Elegir tipo</option>
                {
                  campaignTypeList.map(campaignType => (
                    <option value={campaignType.campaignTypeId}>{campaignType.campaignTypeDescription}</option>
                  ))
                } 
              </select>
              <input
                type="number"
                placeholder="Ingrese el año de la campaña" 
                className="w-1/2 ml-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                ref={campaignYearValue}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex justify-around">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha de inicio del periodo</label>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha fin del periodo</label>
            </div>
            <div className="flex justify-between">
              <input
                type="text"
                placeholder="dia" 
                className="mr-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                ref={startDayValue} 
                required
              />
              <p className="text-4xl"> / </p>
              <input
                type="text"
                placeholder="mes" 
                className="mx-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                ref={startMonthValue}
                required
              />
              <p className="text-5xl"> - </p>
              <input
                type="text"
                placeholder="dia" 
                className="mx-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                ref={finishDayValue} 
                required
              />
              <p className="text-4xl"> / </p>
              <input
                type="text"
                placeholder="mes" 
                className="ml-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                ref={finishMonthValue} 
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