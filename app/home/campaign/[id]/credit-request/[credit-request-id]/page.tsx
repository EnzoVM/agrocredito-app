'use client'

import { getCreditRequestService, updateCreditRequestStatusService } from "@/services/credit.request.service"
import { ChangeEvent, useEffect, useState } from "react"
import moment from 'moment'
import 'moment/locale/es'
import AccountSatusPage from "@/app/components/account-status/AccountStatusPage"

export default function CreditRequestDetail ({ params }: { params: { 'credit-request-id': string }}) {
  const [creditRequestDetail, setCreditRequestDetail] = useState<{
    creditRequestId: string
    farmerId: string
    farmerFullNames?: string
    farmerSocialReason?: string
    campaignId: string
    hectareNumber: number
    creditReason: string
    creditAmount: number
    guaranteeDescription: string
    guaranteeAmount: number
    technicalName: string
    assistanceTypeDescription: string
    creditRequestStatus: string
    creditRequestObservation: string
    createDateTime: Date
    updateStatusDateTime?: Date
  }>({
    creditRequestId: '',
    farmerId: '',
    farmerFullNames: '',
    campaignId: '',
    hectareNumber: 0,
    creditReason: '',
    creditAmount: 1000,
    guaranteeDescription: '',
    guaranteeAmount: 0,
    technicalName: '',
    assistanceTypeDescription: '',
    creditRequestStatus: '',
    creditRequestObservation: '',
    createDateTime: new Date()
  })

  const [isLoading, setIsLoading] = useState(true)
  const [editable, setEditable] = useState(false)
  const [creditRequestState, setCreditRequestState] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  useEffect(() => {
    getCreditRequestService({ creditRequestId: params['credit-request-id'] })
      .then(response => {
        setCreditRequestDetail(response)
        setCreditRequestState(response.creditRequestStatus)
        setIsLoading(false)
      })
      .catch(error => {
        console.log(error)
      })
  }, [params])

  const handleChangeCreditRequestStatus = (event: ChangeEvent<HTMLSelectElement>) => {
    const creditRequestStateGot = event.target.value
    console.log(creditRequestStateGot)
    setCreditRequestState(creditRequestStateGot)
  }

  const handleEditCreditRequesStatus = async () => {
    try {
      if (!editable) {
        setEditable(!editable)
        return
      }

      if (creditRequestState === '') {
        setEditable(!editable)
        return
      }

      await updateCreditRequestStatusService({ creditRequestId: params["credit-request-id"], creditRequestStatus: creditRequestState })
      setEditable(!editable)
    } catch (error: any) {
      setErrorMessage(error.message)
    }
  }
  
  return (
    <>
      {
        isLoading
          ? <div className="flex justify-center">
              <div role="status">
                <svg aria-hidden="true" className="inline w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
              </div>
            </div>
          : 
            <div className="mx-auto sm:px-6 lg:px-8">
              <div className="flex justify-between">
                <div className="block w-1/2 mr-2 p-6 bg-white border border-gray-700 rounded-lg dark:bg-gray-800">
                  <div className="flex justify-between mb-4">
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Datos de la solicitud:</h5>
                    <button type="button" onClick={handleEditCreditRequesStatus} className="px-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{editable ? 'Guardar' : 'Editar'}</button>
                  </div>
                  <p className="text-md tracking-tight text-gray-900 dark:text-white">Estado de la solicitud:</p>
                  {
                    errorMessage !== ''
                      ? <div className="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                          <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                          <span className="sr-only">Info</span>
                          <div>
                            <span className="font-medium">Algo salió mal!</span> {errorMessage}
                          </div>
                        </div>
                      : <></>
                  }
                  {
                    editable
                      ? <select name="creditRequestState" onChange={handleChangeCreditRequestStatus} className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                          <option value="">Elegir estado de solicitud</option>
                          <option value="Aprobado">Aprobado</option>
                          <option value="Rechazado">Rechazado</option>
                        </select>
                      : creditRequestState === 'Pendiente' 
                          ? <div className="mb-2">
                              <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Pendiente</span>
                            </div>
                          : creditRequestState === 'Aprobado'
                            ? <div className="mb-2">
                                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Aprobado</span>
                              </div>  
                            : creditRequestState === 'Rechazado'
                              ? <div className="mb-2">
                                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Rechazado</span>
                                </div>
                              : <div className="mb-2">
                                  <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Pagado</span>
                                </div>
                  }
                  <p className="text-md tracking-tight text-gray-900 dark:text-white">Campaña:</p>
                  <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{creditRequestDetail.campaignId}</p>
                  <p className="text-md tracking-tight text-gray-900 dark:text-white">Agricultor:</p>
                  <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{creditRequestDetail.farmerId} - {creditRequestDetail.farmerFullNames || creditRequestDetail.farmerSocialReason}</p>
                  <p className="text-md tracking-tight text-gray-900 dark:text-white">Cantidad de hectáreas:</p>
                  <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{creditRequestDetail.hectareNumber}</p>
                  <p className="text-md tracking-tight text-gray-900 dark:text-white">Razón del crédito:</p>
                  <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{creditRequestDetail.creditReason}</p>
                  <p className="text-md tracking-tight text-gray-900 dark:text-white">Monto del crédito:</p>
                  <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{creditRequestDetail.creditAmount}</p>
                  <p className="text-md tracking-tight text-gray-900 dark:text-white">Garantía:</p>
                  <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{creditRequestDetail.guaranteeDescription}</p>
                  <p className="text-md tracking-tight text-gray-900 dark:text-white">Valor de la garantía:</p>
                  <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{creditRequestDetail.guaranteeAmount}</p>
                  <p className="text-md tracking-tight text-gray-900 dark:text-white">Tipo de asistencia:</p>
                  <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{creditRequestDetail.assistanceTypeDescription}</p>
                  <p className="text-md tracking-tight text-gray-900 dark:text-white">Nombre del técnico:</p>
                  <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{creditRequestDetail.technicalName}</p>
                  <p className="text-md tracking-tight text-gray-900 dark:text-white">Observaciones:</p>
                  <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{creditRequestDetail.creditRequestObservation}</p>
                  <p className="text-md tracking-tight text-gray-900 dark:text-white">Fecha de solicitud del crédito:</p>
                  <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{moment(creditRequestDetail.createDateTime).format('LLLL')}</p>
                  <p className="text-md tracking-tight text-gray-900 dark:text-white">Fecha de modificación del estado de la solicitud:</p>
                  <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{creditRequestDetail.updateStatusDateTime ? moment(creditRequestDetail.updateStatusDateTime).format('LLLL') : 'Sin modificaciones'}</p>
                </div>
                <AccountSatusPage creditRequestId={params["credit-request-id"]} />
              </div>
            </div>
      }
    </>
  )
}