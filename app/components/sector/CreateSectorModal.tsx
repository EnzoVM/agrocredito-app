import { createSectorService } from "@/services/sector.service";
import { Button, Modal } from "flowbite-react";
import React, { Dispatch, SetStateAction } from "react";
import { FormEvent, useState } from "react";

interface Props {
  modalFormIsOpen: boolean
  setModalFormIsOpen: (modalFormIsOpen: boolean) => void
  setPaginationSelected: Dispatch<SetStateAction<number>>
  setFilters: Dispatch<SetStateAction<{
    sectorDescription: string;
    page: number;
    limit: number;
    typeSearch: 'all' | 'sector' | 'name' | 'both'
  }>>
  setPaginationNumbers: Dispatch<SetStateAction<number[]>>
}

export default function CreateSectorModal ({ 
  modalFormIsOpen, 
  setModalFormIsOpen, 
  setPaginationSelected, 
  setFilters, 
  setPaginationNumbers
}: Props) {

  const [authFailed, setAuthFailed] = useState('')
  const sectorDescriptionValue = React.useRef(null)

  const clearInputFields = () => {
    //@ts-ignore
    sectorDescriptionValue.current.value=''
  }

  const getValueInputs = () => {
    return {
      //@ts-ignore
      sectorDescription: sectorDescriptionValue.current?.value
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
    const sectorData = getValueInputs()
    
    createSectorService({
      sectorDescription: String(sectorData.sectorDescription)
    })
    .then(response => {
      console.log(response)
      clearInputFields()
      setFilters({
        sectorDescription: '', 
        page: 1, 
        limit: 8, 
        typeSearch: 'all'
      })
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
          Creación de un nuevo sector
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
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre del sector:</label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Ingrese el nombre del sector"
                ref={sectorDescriptionValue}
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
            Crear sector
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