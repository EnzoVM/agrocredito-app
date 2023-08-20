import { listCurrentAccountService } from "@/services/current.account.service"
import { listFinancialSourceService } from "@/services/financial.source.service"
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, use, useEffect, useState } from "react"
import FarmerListModal from "../credit-request/FarmerListModal"
import ErrorMessageModal from "../credit-request/ErrorMessageModal"
import { Button } from "flowbite-react"
import moment from "moment"
import { createPaymentsService } from "@/services/payment.service"

export default function CreatePayment ({campaignId, setToggleCreate}:{campaignId: string, setToggleCreate: Dispatch<SetStateAction<boolean>>}) {
  
  const [currentAccountList, setCurrentAccountList] = useState<{
    currentAccountId: number, 
    currentAccountDescription: string
  }[]>([])

  const [financialSourceList, setFinancialSourceList] = useState<{
    financialSourceId: number, 
    financialSourceDescription: string
  }[]>([])

  const [creditRequestApprovedList, setCreditRequestApprovedList] = useState<{
    creditRequestId: string
    creditAmount: number,
    createDateTime: string
  }[]>([])

  const [payment, setPayment] = useState<{
    creditRequestId: string
    paymentDateTime: string
    financialSourceId: number
    currentAccountId: number
    paymentDescription: string
    paymentAmountPEN: number
    exchangeRate: number
  }>({
    creditRequestId: '',
    paymentDateTime: '',
    financialSourceId: 0,
    currentAccountId: 0,
    paymentDescription: '',
    paymentAmountPEN: 0,
    exchangeRate: 0
  })

  const [modalFormIsOpen, setModalFormIsOpen] = useState(false)
  const [modalErrorMessageIsOpen, setModalErrorMessageIsOpen] = useState(false)
  const [farmer, setFarmer] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [paymentAmountUSD, setPaymentAmountUSD] = useState('')
  const [paymentAmountPEN, setPaymentAmountPEN] = useState(0)
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
  }, [])

  const handleChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    if(
      event.target.name === 'financialSourceId' ||
      event.target.name === 'currentAccountId'
    ) {
      setPayment({
        ... payment,
        [event.target.name]: Number(event.target.value)
      })
    } else {
      setPayment({
        ... payment,
        [event.target.name]: event.target.value
      })
    }
  }
  
  const handleSetAmountPEN = (event: ChangeEvent<HTMLInputElement>) => {
    const amountPEN: number = Number(event.target.value)
    setPaymentAmountPEN(amountPEN)
    
    let amountUSD: number = 0
    if(exchangeRateValue !== 0){
      amountUSD = amountPEN/exchangeRateValue
    }
    setPaymentAmountUSD(amountUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD'}))
    setPayment({... payment, paymentAmountPEN: amountPEN})
  }

  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const exchangeRate: number = Number(event.target.value)
    setExchangeRateValue(exchangeRate)
    
    let amountUSD: number = 0
    if(exchangeRate !== 0){
      amountUSD = paymentAmountPEN/exchangeRate
    }
    setPaymentAmountUSD(amountUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD'})) 
    setPayment({... payment, exchangeRate})
  }
  
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    createPaymentsService(payment)
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
                  <select name="creditRequestId" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                    <option value="">Elegir tipo</option>
                    {
                      creditRequestApprovedList.map(creditApproved => (
                        <option key={creditApproved.creditRequestId} value={creditApproved.creditRequestId}>Credito - $/{creditApproved.creditAmount} - {moment(creditApproved.createDateTime).format('LL')}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div className="flex justify-between">   
                <div className="mb-6 w-full mr-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Monto en soles (S/):</label>
                  <input
                    type="number"
                    placeholder="Monto de la entrega en soles" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handleSetAmountPEN}
                    step="0.01"
                    required
                  />
                </div>
                <div className="mb-6 w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo de cambio:</label>
                  <input
                    type="number"
                    placeholder="Ingrese el tipo de cambio" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    onChange={handleChangeAmount}
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between"> 
                <div className="mb-6 w-full mr-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Monto en dolares ($/):</label>
                  <input
                    type="text"
                    placeholder="Monto de la entrega en dolares"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 cursor-not-allowed focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    value={paymentAmountUSD}
                    required
                    disabled
                  />
                </div>  
                <div className="mb-6 w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha de entrega:</label>
                  <input
                    type="datetime-local"
                    placeholder="Ingrese la fecha correspondiente" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    name="paymentDateTime"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <div className="mb-6 w-full mr-4">
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
                <div className="mb-6 w-full">
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
              </div>
              <div className="flex justify-between">
                <div className="mb-6 w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción del abono:</label>
                  <input
                    type="text"
                    placeholder="Ingrese la glosa de la entrega" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    name="paymentDescription"
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