import { listCurrentAccountService } from "@/services/current.account.service"
import { listFinancialSourceService } from "@/services/financial.source.service"
import { listProviderService } from "@/services/provider.service"
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, use, useEffect, useState } from "react"
import FarmerListModal from "../credit-request/FarmerListModal"
import ErrorMessageModal from "../credit-request/ErrorMessageModal"
import { Button } from "flowbite-react"
import moment from "moment"
import { countDeliveriesByCreditRequestIdService, createDeliveryService } from "@/services/delivery.service"

export default function CreateDelivery ({campaignId, setToggleCreate}:{campaignId: string, setToggleCreate: Dispatch<SetStateAction<boolean>>}) {
  
  const [currentAccountList, setCurrentAccountList] = useState<{
    currentAccountId: number, 
    currentAccountDescription: string
  }[]>([])

  const [financialSourceList, setFinancialSourceList] = useState<{
    financialSourceId: number, 
    financialSourceDescription: string
  }[]>([])

  const [providerList, setProviderList] = useState<{
    providerId: number, 
    providerDescription: string
  }[]>([])

  const [creditRequestApprovedList, setCreditRequestApprovedList] = useState<{
    creditRequestId: string
    creditAmount: number,
    createDateTime: string
  }[]>([])

  const [delivery, setDelivery] = useState<{
    creditRequestId: string,
    deliveryDatetime: string,
    providerId: number,
    financialSourceId: number,
    currentAccountId: number,
    gloss: string,
    exchangeRate: number
  }>({
    creditRequestId: '',
    deliveryDatetime: '',
    providerId: 0,
    financialSourceId: 0,
    currentAccountId: 0,
    gloss: '',
    exchangeRate: 0
  })

  const [modalFormIsOpen, setModalFormIsOpen] = useState(false)
  const [modalErrorMessageIsOpen, setModalErrorMessageIsOpen] = useState(false)
  const [farmer, setFarmer] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [deliveryAmountUSD, setDeliveryAmountUSD] = useState('')
  const [deliveryAmountPEN, setDeliveryAmountPEN] = useState('')
  const [exchangeRateValue, setExchangeRateValue] = useState(0)
  
  useEffect(() => {
    listCurrentAccountService()
      .then(response => {
        console.log(response)
        setCurrentAccountList(response)
      })
      .catch(error => console.log(error.message))
    
    listFinancialSourceService()
      .then(response => {
        console.log(response)
        setFinancialSourceList(response)
      })
      .catch(error => console.log(error.message))
    
    listProviderService()
      .then(response => {
        console.log(response)
        setProviderList(response)
      })
      .catch(error => console.log(error.message))
  }, [])

  const handleChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    if(
      event.target.name === 'providerId' ||
      event.target.name === 'financialSourceId' ||
      event.target.name === 'currentAccountId'
    ) {
      setDelivery({
        ... delivery,
        [event.target.name]: Number(event.target.value)
      })
    }else if(event.target.name === 'deliveryDatetime'){
      const [year, month, day] = event.target.value.split('-')

      setDelivery({
        ... delivery,
        [event.target.name]: day+'/'+month+'/'+year
      })
    } else {
      setDelivery({
        ... delivery,
        [event.target.name]: event.target.value
      })
    }
  }
  
  const handleDeliveryAmount = async (event: ChangeEvent<HTMLSelectElement>) => {
    const creditRequestId = event.target.value
    const deliveryAmount = event.target.options[event.target.selectedIndex].getAttribute('data-value2')
    
    let amountUSD: number = 0
    const numOfDeliveries = await countDeliveriesByCreditRequestIdService({creditRequestId})
    if(numOfDeliveries === 0){
      amountUSD = Number(deliveryAmount)*0.80
    }
    if(numOfDeliveries === 1){
      amountUSD = Number(deliveryAmount)*0.20
    }
    if(numOfDeliveries >= 2){
      event.target.value=''
      setErrorMessage('Ya sobrepaso el limite de entrgas para la solicitud de credito especificada')
      setModalErrorMessageIsOpen(true)
    }

    setDeliveryAmountUSD(amountUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD'}))
    const amountPEN = amountUSD*exchangeRateValue
    setDeliveryAmountPEN(amountPEN.toLocaleString('es-PE', { style: 'currency', currency: 'PEN'}))
    setDelivery({... delivery, creditRequestId})
  }

  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const exchangeRate = Number(event.target.value)
    const amountUSD = parseFloat(deliveryAmountUSD.replace(/[^\d.-]/g, ''))
    const amountPEN = amountUSD*exchangeRate

    setDeliveryAmountPEN(amountPEN.toLocaleString('es-PE', { style: 'currency', currency: 'PEN'}))
    setExchangeRateValue(exchangeRate)
    setDelivery({... delivery, exchangeRate})
  }
  
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    createDeliveryService(delivery)
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

  return(
    <>
      <FarmerListModal
      modalFormIsOpen={modalFormIsOpen} 
      setModalFormIsOpen={setModalFormIsOpen}
      setFarmer={setFarmer}
      campaignId={campaignId}
      setCreditRequestApprovedList={setCreditRequestApprovedList}
      setDeliveryAmountPEN={setDeliveryAmountPEN}
      setDeliveryAmountUSD={setDeliveryAmountUSD}
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
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Créditos aprobados:</label>
                  <select onChange={handleDeliveryAmount} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                    <option value="">Elegir tipo</option>
                    {
                      creditRequestApprovedList.map(creditApproved => (
                        <option key={creditApproved.creditRequestId} value={creditApproved.creditRequestId} data-value2={creditApproved.creditAmount}>Credito - $/{creditApproved.creditAmount} - {moment(creditApproved.createDateTime).format('LLLL')}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div className="flex justify-between">   
                <div className="mb-6 w-full mr-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Monto en dolares ($):</label>
                  <input
                    type="text"
                    placeholder="Monto de la entrega en dolares" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 cursor-not-allowed focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={deliveryAmountUSD}
                    required
                    disabled
                  />
                </div>
                <div className="mb-6 w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo de cambio:</label>
                  <input
                    type="number"
                    placeholder="Ingrese el tipo de cambio" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    onChange={handleChangeAmount}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between"> 
                <div className="mb-6 w-full mr-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Monto en soles (S/):</label>
                  <input
                    type="text"
                    placeholder="Monto de la entrega en soles" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 cursor-not-allowed focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    value={deliveryAmountPEN}
                    required
                    disabled
                  />
                </div>  
                <div className="mb-6 w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha de entrega:</label>
                  <input
                    type="date"
                    placeholder="Ingrese el objeto del prestamo" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    name="deliveryDatetime"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <div className="mb-6 w-full mr-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Proveedor:</label>
                  <select name='providerId' onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                    <option value="">Elegir proveedor</option>
                    {
                      providerList.map(provider => (
                        <option key={provider.providerId} value={provider.providerId}>{provider.providerDescription}</option>
                      ))
                    }
                  </select>
                </div> 
                <div className="mb-6 w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fuente financiera:</label>
                  <select name='financialSourceId' onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                    <option value="">Elegir fuente</option>
                    {
                      financialSourceList.map(financial => (
                        <option key={financial.financialSourceId} value={financial.financialSourceId}>{financial.financialSourceDescription}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="mb-6 w-full mr-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cuenta corriente:</label>
                  <select name='currentAccountId' onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                    <option value="">Elegir cuenta</option>
                    {
                      currentAccountList.map(account => (
                        <option key={account.currentAccountId} value={account.currentAccountId}>{account.currentAccountDescription}</option>
                      ))
                    }
                  </select>
                </div>  
                <div className="mb-6 w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Glosa:</label>
                  <input
                    type="text"
                    placeholder="Ingrese la glosa de la entrega" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    name="gloss"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between">   
                <div className="w-full mr-4">
                <Button
                  className="mr-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                  type="submit"
                >
                  Crear entrega
                </Button>
                <Button
                  className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 inline-flex items-center"
                  onClick={() => setToggleCreate(false)}
                >
                  Cancelar
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