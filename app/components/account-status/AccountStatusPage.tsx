import { AccountStatusModel, getAccountState } from "@/services/account.state.service";
import moment from "moment";
import { useEffect, useState } from "react";
import AccountSatusReportGenerator from "./AccountSatusReportGenerator";

export default function AccountSatusPage ({ creditRequestId }: { creditRequestId: string }) {
  const [errorMessage, setErrorMessage] = useState('')

  const [accountStateData, setAccountStateData] = useState<AccountStatusModel>({
    campaignFinishDate: '',
    amountDelivered: 0,
    amountDeliveredPercentage: 0,
    creditAmount: 0,
    delinquentInterest: 0,
    delinquentInterestPercentage: 0,
    finalDebt: 0,
    interest: 0,
    capital: 0,
    interesPercentage: 0,
    payments: [],
    deliveries: [],
    totalPayment: 0,
    farmerData: {
      farmerId: ''
    },
    campaignId: '',
    creditRequesId: ''
  })

  useEffect(() => {
    getAccountState({ creditRequestId, take: 7 })
      .then(response => {
        setAccountStateData(response)
      })
      .catch(error => {
        setErrorMessage(error.message)
      })
  }, [creditRequestId])

  return (
    <div className="block w-full p-6 bg-white border border-gray-700 rounded-lg dark:bg-gray-800">
      <div className="flex direction-row justify-between">
        <h5 className="text-2xl mb-4 font-bold tracking-tight text-gray-900 dark:text-white">Estado de cuenta del crédito:</h5>
        <AccountSatusReportGenerator creditRequestId={creditRequestId} />
      </div>
      {
        errorMessage === ''
          ? <div className="container px-12 pt-4">
              <div className="">
                <div className="w-full h-4 mb-4 bg-gray-200 rounded-full dark:bg-gray-700">
                  <div className="h-4 bg-blue-600 rounded-full dark:bg-blue-500" style={{width: `${accountStateData.amountDeliveredPercentage}%`}}></div>
                </div>
                <div className="flex justify-between direction-row">
                  <div className="text-center">
                    <p className="text-md tracking-tight text-gray-900 dark:text-white">Monto entregado:</p>
                    <p className="text-md tracking-tight text-gray-900 dark:text-white">{(accountStateData.amountDelivered).toLocaleString('es-US', { style: 'currency', currency: 'USD' })} ({accountStateData.amountDeliveredPercentage}%)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-md tracking-tight text-gray-900 dark:text-white">Fecha de vencimiento:</p>
                    <p className="text-md tracking-tight text-gray-900 dark:text-white">{accountStateData.campaignFinishDate}</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex direction-row">
                <div className="dark:bg-gray-600 w-1/2 mr-2 rounded-md">
                  <div className="flex justify-between px-6 pt-4 pb-2">
                    <p className="text-md tracking-tight text-gray-900 dark:text-white">Total de crédito aprobado:</p>
                    <p className="text-md tracking-tight text-gray-900 dark:text-white">{(accountStateData.creditAmount).toLocaleString('es-US', { style: 'currency', currency: 'USD' })}</p>
                  </div>
                  <div className="flex justify-between px-6 py-2">
                    <p className="text-md tracking-tight text-gray-900 dark:text-white">Saldo capital:</p>
                    <p className="text-md tracking-tight text-gray-900 dark:text-white">{(accountStateData.capital).toLocaleString('es-US', { style: 'currency', currency: 'USD' })}</p>
                  </div>
                  <div className="flex justify-between px-6 py-2">
                    <p className="text-md tracking-tight text-gray-900 dark:text-white">Interés ({accountStateData.interesPercentage}%):</p>
                    <p className="text-md tracking-tight text-gray-900 dark:text-white">{(accountStateData.interest).toLocaleString('es-US', { style: 'currency', currency: 'USD' })}</p>
                  </div>
                  <div className="flex justify-between px-6 py-2">
                    <p className="text-md tracking-tight text-gray-900 dark:text-white">Interés moratorio ({accountStateData.delinquentInterestPercentage}%):</p>
                    <p className="text-md tracking-tight text-gray-900 dark:text-white">{(accountStateData.delinquentInterest).toLocaleString('es-US', { style: 'currency', currency: 'USD' })}</p>
                  </div>
                  <div className="flex justify-between px-6 py-2">
                    <p className="text-md tracking-tight text-gray-900 dark:text-white">Total abonado:</p>
                    <p className="text-md tracking-tight text-gray-900 dark:text-white">{(accountStateData.totalPayment).toLocaleString('es-US', { style: 'currency', currency: 'USD' })}</p>
                  </div>
                  <div className="grid grid-cols-1 divide-y">
                    <div></div>
                    <div className="flex justify-between px-6 pb-4 pt-2">
                      <p className="text-md tracking-tight text-gray-900 dark:text-white">Deuda actual:</p>
                      <p className="text-md tracking-tight text-gray-900 dark:text-white">{(accountStateData.finalDebt).toLocaleString('es-US', { style: 'currency', currency: 'USD' })}</p>
                    </div>
                  </div>
                </div>
                <div className="w-1/2">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          <div className="text-center">
                            Fecha de entrega
                          </div>
                        </th>
                        <th scope="col text-center" className="px-6 py-3">
                          <div className="text-center">
                            Monto de entrega
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        accountStateData.deliveries.map(delivery => (
                          <tr key={`${delivery.deliveryAmount}_${new Date().toUTCString()}`} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4">
                              <div className="text-center">
                                {moment(delivery.deliveryDateTime).format('LLLL')}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-center">
                                {(delivery.deliveryAmount).toLocaleString('es-US', { style: 'currency', currency: 'USD' })}
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              <table className="w-full mt-4 text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      <div className="text-center">
                        Fecha de abono
                      </div>
                    </th>
                    <th scope="col text-center" className="px-6 py-3">
                      <div className="text-center">
                        Monto abonado
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    accountStateData.payments.map(payment => (
                      <tr key={`${payment.paymentAmount}_${new Date().toUTCString()}`} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-6 py-4">
                          <div className="text-center">
                            {moment(payment.transactionDateTime).format('LLLL')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-center">
                            {(payment.paymentAmount).toLocaleString('es-US', { style: 'currency', currency: 'USD' })}
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          : <div className="">
            {errorMessage}
          </div>
      }
      
    </div>
  )
}