"use client";

import { getDeliveryPlanModelService } from "@/services/delivery.plan.model.service";
import { listDepartureDetailService } from "@/services/departure.detail.service";
import { useEffect, useState } from "react"
import DeleteDeliveryPlanModelCard from "./DeleteDeliveryPlanModelCard";
import { Button } from "flowbite-react";
import CreateDeliveryPlanModelModal from "./CreateDeliveryPlanModelModal";

interface Props {
  campaignId: string
} 

export default function DeliveryPlanModelCard ({campaignId}: Props) {

  const [deliveryPlanModel, setDeliveryPlanModel] = useState<{
    deliveryPlanModelId: number,
    campaignId: string,
    deliveryPlanModelDescription: string
  }>({
    deliveryPlanModelId: 0,
    campaignId: '',
    deliveryPlanModelDescription: ''
  })

  const [listDepartureDetail, setListDepartureDetail] = useState<{
    departureDetailId: number,
    deliveryPlanModelId: number,
    departureDetailDescription: string,
    departureType: string,
    resource: string,
    amountPerHectare: number
  }[]>([])

  const [modalDeleteDeliveryPlanModelIsOpen, setModalDeleteDeliveryPlanModelIsOpen] = useState(false)
  const [modalFormIsOpen, setModalFormIsOpen] = useState(false)
  const [departureDetailOrDeliveryPlanModelDeleted, setDepartureDetailOrDeliveryPlanModelDeleted] = useState(0)
  const [isLoadding, setIsLoadding] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [typeOfCore, setTypeOfCore] = useState('')

  useEffect(() => {
    setIsLoadding(true)
    getDeliveryPlanModelService({
      campaignId
    }).then(response => {
      setDeliveryPlanModel(response)
      
      listDepartureDetailService({
        deliveryPlanModelId: response.deliveryPlanModelId
      }).then(response => {
        setListDepartureDetail(response)
        console.log(response)
        setIsLoadding(false)

      }).catch(error => {
        console.log(error)
        setIsLoadding(false)
      })

    }).catch(error => {
      console.log(error.message);
      setErrorMessage(error.message)
      setIsLoadding(false)
    })
  }, [campaignId])

  return (
    <>
      <DeleteDeliveryPlanModelCard
        modalDeleteDeliveryPlanModelIsOpen={modalDeleteDeliveryPlanModelIsOpen} 
        setModalDeleteDeliveryPlanModelIsOpen={setModalDeleteDeliveryPlanModelIsOpen}
        departureDetailOrDeliveryPlanModelDeleted={departureDetailOrDeliveryPlanModelDeleted}
        typeOfCore={typeOfCore}
        setDeliveryPlanModel={setDeliveryPlanModel}
        setListDepartureDetail={setListDepartureDetail}
        setErrorMessage={setErrorMessage}
        setIsLoadding={setIsLoadding}
      />
      <CreateDeliveryPlanModelModal
        modalFormIsOpen={modalFormIsOpen} 
        setModalFormIsOpen={setModalFormIsOpen}
        campaignId={campaignId}
        setDeliveryPlanModel={setDeliveryPlanModel}
        setErrorMessage={setErrorMessage}
        typeOfCore={typeOfCore}
        listDepartureDetail={listDepartureDetail}
        setListDepartureDetail={setListDepartureDetail}
        deliveryPlanModelId={deliveryPlanModel.deliveryPlanModelId}
        setIsLoadding={setIsLoadding}
      />
      {
        isLoadding
        ?
          <div className="text-center pt-64">
            <div role="status">
              <svg aria-hidden="true" className="inline w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
            </div>
          </div>
        : 
          <>
            <div className="mb-6">
              { 
                errorMessage === 'There is no delivery plan template assigned to this campaign' || errorMessage === 'The delivery plan model has been deleted successfully'
                ?
                  <div className="grid border border-gray-200 rounded-lg shadow-sm dark:border-gray-700" style={{height: '257px'}}>
                    <div className="flex flex-col items-center justify-center text-center bg-white border-b border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-tl-lg md:border-r dark:bg-gray-800 dark:border-gray-700">
                      <Button
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                        onClick={() => {
                          setModalFormIsOpen(true)
                          setTypeOfCore('DeliveryPlanModel')
                        }}
                      >
                        Crear nuevo modelo de plan de entregas
                      </Button>
                    </div>
                  </div>
                :
                  <>
                    <div className="grid border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 md:mb-1 md:grid-cols-2">
                      <div className="flex flex-col py-2 px-2 bg-white border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-tl-lg dark:bg-gray-800">
                        <h3 className="text-2xl py-1 px-2 font-semibold text-gray-900 dark:text-white">Modelo de plan de entregas</h3>
                      </div>
                      <div className="flex justify-end text-center items-center bg-white border-b border-gray-200 rounded-tr-lg dark:bg-gray-800 dark:border-gray-700">
                        <Button 
                          className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm text-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 inline-flex items-center"
                          onClick={() => {
                            setModalDeleteDeliveryPlanModelIsOpen(true)
                            setDepartureDetailOrDeliveryPlanModelDeleted(deliveryPlanModel.deliveryPlanModelId)
                            setTypeOfCore('DeliveryPlanModel')
                          }}
                          >
                                  Eliminar
                        </Button>
                      </div>
                    </div>
                    <div className="grid border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 md:grid-cols-1">
                      <div className="flex flex-col py-2 px-2 bg-white border-b border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-tl-lg md:border-r dark:bg-gray-800 dark:border-gray-700">
                        <div className="mb-3 px-2">
                          <h5 className="py-1 text-xl tracking-tight text-gray-900 dark:text-white">Campaña:</h5>
                          <p className="font-normal text-gray-700 dark:text-gray-400">{deliveryPlanModel.campaignId}</p>
                        </div>
                        <div className="mb-3 px-2">
                          <h5 className="py-1 text-xl tracking-tight text-gray-900 dark:text-white">Descripcion:</h5>
                          <p className="font-normal text-gray-700 dark:text-gray-400">{deliveryPlanModel.deliveryPlanModelDescription}</p>
                        </div>
                      </div>
                    </div>
                  </>
              }
            </div>

            <div className="flex justify-between" style={{height: '364px'}}>
              {
                listDepartureDetail.length===2
                ? 
                  listDepartureDetail.map(departure => (
                    <div className="mx-2 w-1/2" key={departure.departureDetailId}>
                      <div className="grid border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 md:mb-1 md:grid-cols-2">
                        <div className="flex flex-col py-2 px-2 bg-white border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-tl-lg dark:bg-gray-800">
                          <h3 className="text-2xl py-1 px-2 font-semibold text-gray-900 dark:text-white">Partida</h3>
                        </div>
                        <div className="flex justify-end text-center items-center bg-white border-b border-gray-200 rounded-tr-lg dark:bg-gray-800 dark:border-gray-700">
                          <Button 
                            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm text-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 inline-flex items-center"
                            onClick={() => {
                              setModalDeleteDeliveryPlanModelIsOpen(true)
                              setDepartureDetailOrDeliveryPlanModelDeleted(departure.departureDetailId)
                              setTypeOfCore('DepartureDetail')
                            }}
                            >
                                    Eliminar
                          </Button>
                        </div>
                      </div>
                      <div className="grid border border-gray-200 rounded-lg shadow-sm dark:border-gray-700">
                        <div className="flex flex-col py-1 px-2 bg-white border-b border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-tl-lg md:border-r dark:bg-gray-800 dark:border-gray-700">
                          <div className="mb-3 px-2">
                            <h5 className="py-1 text-xl tracking-tight text-gray-900 dark:text-white">Descripcion de partida:</h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">{departure.departureDetailDescription}</p>
                          </div>
                          <div className="mb-3 px-2">
                            <h5 className="py-1 text-xl tracking-tight text-gray-900 dark:text-white">Tipo de partida:</h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">{departure.departureType}</p>
                          </div>
                          <div className="mb-3 px-2">
                            <h5 className="py-1 text-xl tracking-tight text-gray-900 dark:text-white">Recurso:</h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">{departure.resource}</p>
                          </div>
                          <div className="mb-3 px-2">
                            <h5 className="py-1 text-xl tracking-tight text-gray-900 dark:text-white">Monto x hectarea:</h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">{(departure.amountPerHectare).toLocaleString('es-US', { style: 'currency', currency: 'USD' })}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                : 
                  listDepartureDetail.length===1
                  ?
                    <>
                      {
                        listDepartureDetail.map(departure => (
                          <div className="mx-2 w-1/2" key={departure.departureDetailId}>
                            <div className="grid border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 md:mb-1 md:grid-cols-2">
                              <div className="flex flex-col py-2 px-2 bg-white border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-tl-lg dark:bg-gray-800">
                                <h3 className="text-2xl py-1 px-2 font-semibold text-gray-900 dark:text-white">Partida</h3>
                              </div>
                              <div className="py-2 px-2 text-right bg-white border-b border-gray-200 rounded-tr-lg dark:bg-gray-800 dark:border-gray-700">
                                <Button 
                                  className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm text-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 inline-flex items-center"
                                  onClick={() => {
                                    setModalDeleteDeliveryPlanModelIsOpen(true)
                                    setDepartureDetailOrDeliveryPlanModelDeleted(departure.departureDetailId)
                                    setTypeOfCore('DepartureDetail')
                                  }}
                                  >
                                          Eliminar
                                </Button>
                              </div>
                            </div>
                            <div className="grid border border-gray-200 rounded-lg shadow-sm dark:border-gray-700">
                              <div className="flex flex-col py-1 px-2 bg-white border-b border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-tl-lg md:border-r dark:bg-gray-800 dark:border-gray-700">
                                <div className="mb-3 px-2">
                                  <h5 className="py-1 text-xl tracking-tight text-gray-900 dark:text-white">Descripcion de partida:</h5>
                                  <p className="font-normal text-gray-700 dark:text-gray-400">{departure.departureDetailDescription}</p>
                                </div>
                                <div className="mb-3 px-2">
                                  <h5 className="py-1 text-xl tracking-tight text-gray-900 dark:text-white">Tipo de partida:</h5>
                                  <p className="font-normal text-gray-700 dark:text-gray-400">{departure.departureType}</p>
                                </div>
                                <div className="mb-3 px-2">
                                  <h5 className="py-1 text-xl tracking-tight text-gray-900 dark:text-white">Recurso:</h5>
                                  <p className="font-normal text-gray-700 dark:text-gray-400">{departure.resource}</p>
                                </div>
                                <div className="mb-3 px-2">
                                  <h5 className="py-1 text-xl tracking-tight text-gray-900 dark:text-white">Monto x hectarea:</h5>
                                  <p className="font-normal text-gray-700 dark:text-gray-400">{(departure.amountPerHectare).toLocaleString('es-US', { style: 'currency', currency: 'USD' })}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          ))
                        }
                        <div className=" mx-2 w-1/2 grid border border-gray-200 rounded-lg shadow-sm dark:border-gray-700">
                          <div className="flex flex-col items-center justify-center p-8 text-center bg-white border-b border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-tl-lg md:border-r dark:bg-gray-800 dark:border-gray-700">
                            <Button
                              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                              onClick={() => {
                                setModalFormIsOpen(true)
                                setTypeOfCore('DepartureDetail')
                              }}
                              disabled={errorMessage === 'There is no delivery plan template assigned to this campaign' || errorMessage === 'The delivery plan model has been deleted successfully' ? true : false}
                            >
                              Crear nueva partida
                            </Button>
                          </div>
                        </div>
                    </>
                      
                  : 
                    <>
                      <div className=" mx-2 w-1/2 grid border border-gray-200 rounded-lg shadow-sm dark:border-gray-700">
                        <div className="flex flex-col items-center justify-center p-8 text-center bg-white border-b border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-tl-lg md:border-r dark:bg-gray-800 dark:border-gray-700">
                          <Button
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                            onClick={() => {
                              setModalFormIsOpen(true)
                              setTypeOfCore('DepartureDetail')
                            }}
                            disabled={errorMessage === 'There is no delivery plan template assigned to this campaign' || errorMessage === 'The delivery plan model has been deleted successfully' ? true : false}
                          >
                            Crear nueva partida
                          </Button>
                        </div>
                      </div>
                      <div className=" mx-2 w-1/2 grid border border-gray-200 rounded-lg shadow-sm dark:border-gray-700">
                        <div className="flex flex-col items-center justify-center p-8 text-center bg-white border-b border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-tl-lg md:border-r dark:bg-gray-800 dark:border-gray-700">
                          <Button
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                            onClick={() => {
                              setModalFormIsOpen(true)
                              setTypeOfCore('DepartureDetail')
                            }}
                            disabled={errorMessage === 'There is no delivery plan template assigned to this campaign' || errorMessage === 'The delivery plan model has been deleted successfully' ? true : false}
                          >
                            Crear nueva partida
                          </Button>
                        </div>
                      </div>
                    </>
              }
            </div>
          </>
      }
    </>
  )
}