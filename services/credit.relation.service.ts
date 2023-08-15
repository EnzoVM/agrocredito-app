import axios from 'axios'
import { checkAuthorization } from './check.authorization.service'

export async function listCreditRelationsService ({ 
  campaignId,
  farmerType,
  farmerFullNames,
  farmerSocialReason,
  page,
  limit
}: {
  campaignId: string,
  farmerType: 'Individual' | 'Asociación' | 'All',
  farmerFullNames?: string, 
  farmerSocialReason?: string,
  page: number, 
  limit: number
}): Promise<{
    creditRelations: {
      creditRequestId: string
      farmerId: string
      fullNames?: string
      socialReason?: string
      totalDelivery: number
      totalInterest: number
      capital: number
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
      farmerFullNames: farmerType === 'Individual' ? farmerFullNames || '' : undefined,
      farmerSocialReason,
      page,
      limit
    })

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/credit-relations/list/${jsonFilter}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    console.log(response.data.data)
    
    return response.data.data
  } catch (error: any) {
    if (error.message === 'You have to login again') {
      throw new Error('You have to login again')
    }
    
    throw new Error(error.response.data.message)
  }
}
