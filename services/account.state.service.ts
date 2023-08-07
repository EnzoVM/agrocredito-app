import axios from 'axios'
import { checkAuthorization } from './check.authorization.service'

export interface AccountStatusModel {
  amountDelivered: number
  amountDeliveredPercentage: number
  creditAmount: number
  interest: number
  interesPercentage: number
  delinquentInterest: number
  delinquentInterestPercentage: number
  totalPayment: number
  finalDebt: number
  payments: Payment[]
}

interface Payment {
  transactionDateTime: Date,
  paymentAmount: number
}

export async function getAccountState ({ creditRequestId }: { creditRequestId: string }): Promise<AccountStatusModel> {
  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/account-status/${creditRequestId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    return response.data.data

  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}
