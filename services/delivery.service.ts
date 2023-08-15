import axios from 'axios'
import { checkAuthorization } from './check.authorization.service'

export async function listDeliveriesService ({ 
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
    deliveries: {
      deliveryId: number
      campaignId: string
      fullNames?: string
      socialReason?: string
      deliveryDateTime: Date
      providerDescription: string
      financialSourceDescription: string
      currentAccountDescription: string
      gloss: string
      deliveryAmount: number
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

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/deliveries/list/${jsonFilter}`, {
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

export async function createDeliveryService ({ 
  creditRequestId,
  deliveryDatetime,
  providerId,
  financialSourceId,
  currentAccountId,
  gloss,
  exchangeRate
}: {
  creditRequestId: string,
  deliveryDatetime: string
  providerId: number
  financialSourceId: number
  currentAccountId: number
  gloss: string,
  exchangeRate: number
}): Promise<string> {
  
  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/deliveries`, {
      creditRequestId,
      deliveryDatetime,
      providerId,
      financialSourceId,
      currentAccountId,
      gloss,
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

export async function countDeliveriesByCreditRequestIdService ({ 
  creditRequestId
}: {
  creditRequestId: string
}): Promise<number> {
  
  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/deliveries/list/count/${creditRequestId}`, {
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