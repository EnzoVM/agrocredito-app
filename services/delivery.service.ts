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
  farmerType: 'Individual' | 'Asociación',
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
    count: number
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
    throw new Error(error.response.data.message)
  }
}