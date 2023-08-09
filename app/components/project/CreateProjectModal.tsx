import { createCampaignService } from "@/services/campaign.service";
import { listCampaignTypeService } from "@/services/campaign.type.service";
import { createProjectService } from "@/services/project.service";
import { Button, Modal } from "flowbite-react";
import React, { Dispatch, SetStateAction } from "react";
import { FormEvent, useEffect, useState } from "react";

interface Props {
  modalFormIsOpen: boolean
  setModalFormIsOpen: (modalFormIsOpen: boolean) => void
  setPaginationSelected: Dispatch<SetStateAction<number>>
  setFilters: Dispatch<SetStateAction<{
    sectorId: number;
    projectDescription: string;
    page: number;
    limit: number;
    typeSearch: 'all' | 'sector' | 'name' | 'both'
  }>>
  setPaginationNumbers: Dispatch<SetStateAction<number[]>>
  setSectorIdValue: Dispatch<SetStateAction<number>>
}

export default function CreateProjectModal ({ 
  modalFormIsOpen, 
  setModalFormIsOpen, 
  setPaginationSelected, 
  setFilters, 
  setPaginationNumbers,
  setSectorIdValue
}: Props) {

  const [authFailed, setAuthFailed] = useState('')
  const sectorIdValue = React.useRef(null)
  const projectDescriptionValue = React.useRef(null)

  const clearInputFields = () => {
    //@ts-ignore
    sectorIdValue.current.value=0
    //@ts-ignore
    projectDescriptionValue.current.value=''
  }

  const getValueInputs = () => {
    return {
      //@ts-ignore
      sectorId: sectorIdValue.current?.value,
      //@ts-ignore
      projectDescription: projectDescriptionValue.current?.value
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
    const projectData = getValueInputs()
    
    createProjectService({
      projectDescription: String(projectData.projectDescription),
      sectorId: Number(projectData.sectorId)
    })
    .then(response => {
      console.log(response)
      clearInputFields()
      setFilters({
        sectorId: 0, 
        projectDescription: '', 
        page: 1, 
        limit: 8, 
        typeSearch: 'all'
      })
      setPaginationSelected(1)
      setPaginationNumbers([1,2,3,4,5])
      setModalFormIsOpen(false)
      setSectorIdValue(0)
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
          Creación de un nuevo Proyecto
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
            <div className="w-full mr-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sector:</label>
              <select name="campaignTypeId" ref={sectorIdValue} className="w-full mr-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="0">Elegir sector</option>
                <option value="2">Margen izquierda - 2</option>
                <option value="3">Tumbes - 3</option>
                <option value="4">Margen derecha - 4</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre del Proyecto:</label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Ingrese la descripción de la campaña"
                ref={projectDescriptionValue}
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
            Crear proyecto
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