import axios from 'axios'
import { checkAuthorization } from './check.authorization.service'
import { createLogRecord, setEndRequestTimeByLogRecordId } from './log.record.service'

export interface AccountStatusModel {
  campaignFinishDate: string
  amountDelivered: number
  amountDeliveredPercentage: number
  creditAmount: number
  interest: number
  interesPercentage: number
  delinquentInterest: number
  delinquentInterestPercentage: number
  totalPayment: number
  finalDebt: number
  payments: Payment[],
  deliveries: Delivery[]
}

interface Payment {
  transactionDateTime: Date,
  paymentAmount: number
}

interface Delivery {
  deliveryDateTime: Date,
  deliveryAmount: number
}

export async function getAccountState ({ creditRequestId }: { creditRequestId: string }): Promise<AccountStatusModel> {
  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const initRequestTime = new Date()

    const { recordId } = await createLogRecord({
      resource: 'interest-calculated',
      method: 'GET',
      initRequestTime
    })

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/account-status/${creditRequestId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const endRequestTime = new Date()

    await setEndRequestTimeByLogRecordId({
      recordId,
      endRequestTime
    })

    return response.data.data

  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}
