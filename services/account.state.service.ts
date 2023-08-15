import axios from 'axios'
import { checkAuthorization } from './check.authorization.service'
import { createLogRecord, setEndRequestTimeByLogRecordId } from './log.record.service'

export interface AccountStatusModel {
  campaignFinishDate: '',
  amountDelivered: 0,
  amountDeliveredPercentage: 0,
  creditAmount: 0,
  delinquentInterest: 0,
  delinquentInterestPercentage: 0,
  finalDebt: 0,
  interest: 0,
  interesPercentage: 0,
  payments: {
    transactionDateTime: Date,
    paymentAmount: number
  }[],
  deliveries: {
    deliveryDateTime: Date, deliveryAmount: number
  }[],
  totalPayment: 0,
  farmerData: {
    farmerId: string,
    fullName?: string,
    socialReason?: string,
  }
  campaignId: string,
  creditRequesId: string
}

interface Payment {
  transactionDateTime: Date,
  paymentAmount: number
}

interface Delivery {
  deliveryDateTime: Date,
  deliveryAmount: number
}

export async function getAccountState ({ creditRequestId, take }: { creditRequestId: string, take?: number }): Promise<AccountStatusModel> {
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

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/account-status/${creditRequestId}/${take}`, {
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
    if (error.message === 'You have to login again') {
      throw new Error('You have to login again')
    }
    throw new Error(error.response.data.message)
  }
}
