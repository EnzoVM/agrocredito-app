import { AccountStatusModel, getAccountState } from "@/services/account.state.service";
import moment from "moment";
import { useEffect, useState } from "react";

export default function AccountSatusPage ({ creditRequestId }: { creditRequestId: string }) {
  const [accountStateData, setAccountStateData] = useState<AccountStatusModel>({
    amountDelivered: 0,
    amountDeliveredPercentage: 0,
    creditAmount: 0,
    delinquentInterest: 0,
    finalDebt: 0,
    interest: 0,
    payments: [],
    totalPayment: 0
  })

  useEffect(() => {
    getAccountState({ creditRequestId })
      .then(response => {
        console.log(response)
        setAccountStateData(response)
      })
      .catch(error => {
        console.log(error)
      })
  }, [creditRequestId])

  return (
    <div className="block w-full p-6 bg-white border border-gray-700 rounded-lg dark:bg-gray-800">
      <h5 className="text-2xl mb-4 font-bold tracking-tight text-gray-900 dark:text-white">Estado de cuenta del crédito:</h5>
      <div className="container px-32 pt-4">
        <div className="">
          <div className="w-full h-4 mb-4 bg-gray-200 rounded-full dark:bg-gray-700">
            <div className="h-4 bg-blue-600 rounded-full dark:bg-blue-500" style={{width: `${accountStateData.amountDeliveredPercentage}%`}}></div>
          </div>
          <div className="text-center">
            <p className="text-md tracking-tight text-gray-900 dark:text-white">Monto entregado:</p>
            <p className="text-md tracking-tight text-gray-900 dark:text-white">${accountStateData.amountDelivered} ({accountStateData.amountDeliveredPercentage}%)</p>
          </div>
        </div>
        <div className="pt-4">
          <div className="dark:bg-gray-600 rounded-md">
            <div className="flex justify-between px-12 pt-4 pb-2">
              <p className="text-md tracking-tight text-gray-900 dark:text-white">Total de crédito aprobado:</p>
              <p className="text-md tracking-tight text-gray-900 dark:text-white">{accountStateData.creditAmount}</p>
            </div>
            <div className="flex justify-between px-12 py-2">
              <p className="text-md tracking-tight text-gray-900 dark:text-white">Interes:</p>
              <p className="text-md tracking-tight text-gray-900 dark:text-white">${accountStateData.interest}</p>
            </div>
            <div className="flex justify-between px-12 py-2">
              <p className="text-md tracking-tight text-gray-900 dark:text-white">Interes moratorio:</p>
              <p className="text-md tracking-tight text-gray-900 dark:text-white">${accountStateData.delinquentInterest}</p>
            </div>
            <div className="flex justify-between px-12 py-2">
              <p className="text-md tracking-tight text-gray-900 dark:text-white">Total abonado:</p>
              <p className="text-md tracking-tight text-gray-900 dark:text-white">${accountStateData.totalPayment}</p>
            </div>
            <div className="grid grid-cols-1 divide-y">
              <div></div>
              <div className="flex justify-between px-12 pb-4 pt-2">
                <p className="text-md tracking-tight text-gray-900 dark:text-white">Deuda actual:</p>
                <p className="text-md tracking-tight text-gray-900 dark:text-white">${accountStateData.finalDebt}</p>
              </div>
            </div>
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
                  <td className="px-6 py-4">{moment(payment.transactionDateTime).format('LLLL')}</td>
                  <td className="px-6 py-4">
                    <div className="text-center">
                      ${payment.paymentAmount}
                    </div>
                  </td>     
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}