import { deleteFarmerService } from "@/services/farmer.service";
import { Modal } from "flowbite-react";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  modalDeleteCampaignIsOpen: boolean
  setModalDeleteCampaignIsOpen: (modalDeleteCampaignIsOpen: boolean) => void
  farmerId: string,
  setFilters: Dispatch<SetStateAction<{
    searchType: 'code' | 'name'
    farmerId: string
    farmerFullNames: string
    farmerSocialReason: string
    farmerType: 'Individual' | 'Asociación'
    page: number, 
    limit: number
  }>>
  setPaginationSelected: Dispatch<SetStateAction<number>>
  setPaginationNumbers: Dispatch<SetStateAction<number[]>>
}

export default function DeleteFarmerModal ({ modalDeleteCampaignIsOpen, setModalDeleteCampaignIsOpen, farmerId, setFilters, setPaginationSelected, setPaginationNumbers }: Props) {
  
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handlerDelete = async () => {
    try {
      const farmerMessageDeleted = await deleteFarmerService({ farmerId })
      console.log(farmerMessageDeleted)

      setFilters({
        searchType: 'code',
        farmerId: '',
        farmerFullNames: '',
        farmerSocialReason: '',
        farmerType: 'Individual',
        page: 1,
        limit: 6
      })
      setPaginationSelected(1)
      setPaginationNumbers([1,2,3,4,5])
      setModalDeleteCampaignIsOpen(false)
      setErrorMessage('')
    } catch (error: any) {
      setErrorMessage(error.message)
    }
  }
  
  return (
    <Modal show={modalDeleteCampaignIsOpen} onClose={() => setModalDeleteCampaignIsOpen(false)}>
      <Modal.Body className="bg-white rounded-lg shadow dark:bg-gray-700">
        <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="popup-modal">
            <svg aria-hidden="true" onClick={() => { 
              setModalDeleteCampaignIsOpen(false)
              setErrorMessage('')
            }} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            <span className="sr-only">Close modal</span>
        </button>
        <div className="p-6 text-center">
            <svg aria-hidden="true" className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">¿Está seguro de que desea eliminar al agriculor: {farmerId}?</h3>
            {
              errorMessage
                ? <div className="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                    <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Info</span>
                    <div>
                      <span className="font-medium">Algo salió mal!</span> {errorMessage}
                    </div>
                  </div>
                : <></>
            }
            <button 
            data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2" 
            onClick={handlerDelete}>
                Sí, eliminalo
            </button>
            <button 
            data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" 
            onClick={() => { 
              setModalDeleteCampaignIsOpen(false)
              setErrorMessage('')
            }}>
              No, cancelalo
            </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}