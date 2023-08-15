import axios from 'axios'
import { checkAuthorization } from './check.authorization.service'

export async function listPaymentsService ({ 
  campaignId,
  farmerType,
  fullNames,
  socialReason,
  page,
  limit
}: {
  campaignId: string,
  farmerType: 'Individual' | 'Asociación' | 'All',
  fullNames?: string, 
  socialReason?: string,
  page: number, 
  limit: number
}): Promise<{
    payments: {
      paymentId: number
      socialReason?: string
      fullNames?: string
      paymentDateTime: Date
      financialSourceDescription: string
      currentAccountDescription: string
      paymentDescription: string
      paymentAmount: number
    }[], 
    count: number,
    totalAmount: number
  }> {
  try {

    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    let jsonFilter = JSON.stringify({
      campaignId,
      farmerType,
      fullNames,
      socialReason,
      page,
      limit
    })

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/list/${jsonFilter}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.data
  } catch (error: any) {
    if (error.message === 'You have to login again') {
      throw new Error('You have to login again')
    }
    throw new Error(error.response.data.message)
  }
}

export async function createPaymentsService ({
  creditRequestId,
  paymentDateTime,
  financialSourceId,
  currentAccountId,
  paymentDescription,
  paymentAmountPEN,
  exchangeRate
}:{
  creditRequestId: string
  paymentDateTime: string
  financialSourceId: number
  currentAccountId: number
  paymentDescription: string
  paymentAmountPEN: number
  exchangeRate: number
}): Promise<string> {
  try {

    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }
    
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/payments`, {
      creditRequestId,
      paymentDateTime,
      financialSourceId,
      currentAccountId,
      paymentDescription,
      paymentAmountPEN,
      exchangeRate
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.message

  } catch (error: any) {
    if (error.message === 'You have to login again') {
      throw new Error('You have to login again')
    }
    throw new Error(error.response.data.message)
  }
}