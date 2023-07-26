import axios from 'axios'
import { checkAuthorization } from './check.authorization.service'

export async function listCreditRequestService ({ 
  campaignId,
  farmerType,
  creditRequestStatus,
  farmerFullNames,
  farmerSocialReason,
  page,
  limit
}: {
  campaignId: string,
  farmerType: 'Individual' | 'Asociación' | 'All', 
  creditRequestStatus?: 'Aprobado' | 'Pendiente' | 'Rechazado' | 'Pagado', 
  farmerFullNames?: string, 
  farmerSocialReason?: string,
  page: number, 
  limit: number
}): Promise<{
    creditRequests: {
      creditRequestId: string
      campaignId: string
      fullNames?: string
      socialReason?: string
      creditAmount: number
      createDateTime: Date
      updateStatusDateTime?: Date
      creditRequestStatus: string
    }[], 
    count: number
  }> {
  try {

    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    let jsonFilter = {}

    if (typeof creditRequestStatus === 'undefined') {
      jsonFilter = JSON.stringify({
        campaignId,
        farmerType,
        farmerFullNames: farmerType === 'Individual' ? farmerFullNames || '' : undefined,
        farmerSocialReason,
        page,
        limit
      })
    } else {
        jsonFilter = JSON.stringify({
          campaignId,
          farmerType,
          creditRequestStatus,
          farmerFullNames: farmerType === 'Individual' ? farmerFullNames || '' : undefined,
          farmerSocialReason,
          page,
          limit
        })
    }

    console.log(jsonFilter)

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/credit-requests/list/${jsonFilter}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    console.log(response.data.data)
    
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

export async function getCreditRequestService ({ 
  creditRequestId
}: {
  creditRequestId: string
}): Promise<{
  creditRequestId: string
  farmerId: string
  farmerFullNames?: string
  farmerSocialReason?: string
  campaignId: string
  hectareNumber: number
  creditReason: string
  creditAmount: number
  guaranteeDescription: string
  guaranteeAmount: number
  technicalName: string
  assistanceTypeDescription: string
  creditRequestStatus: string
  creditRequestObservation: string
  createDateTime: Date
  updateStatusDateTime?: Date
}> {
  try {

    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/credit-requests/${creditRequestId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

export async function updateCreditRequestStatusService ({ 
  creditRequestId,
  creditRequestStatus
}: {
  creditRequestId: string,
  creditRequestStatus: string
}): Promise<string> {
  try {

    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/credit-requests/${creditRequestId}`, 
    {
      creditRequestStatus
    },{
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

export async function createCreditRequestService ({ 
  farmerId,
  campaignId,
  hectareNumber,
  creditReason,
  creditAmount,
  guaranteeDescription,
  guaranteeAmount,
  technicalId,
  creditRequestObservation
}: {
  farmerId: string,
  campaignId: string,
  hectareNumber: number,
  creditReason: string,
  creditAmount: number,
  guaranteeDescription: string,
  guaranteeAmount: number,
  technicalId: number,
  creditRequestObservation: string
}): Promise<{
  creditRequestId: string,
  farmerId: string,
  campaignId: string,
  hectareNumber: number,
  creditReason: string,
  creditAmount: number,
  guaranteeDescription: string,
  guaranteeAmount: number,
  technicalId: number,
  creditRequestStatus: string,
  creditRequestObservation: string
}> {
  try {

    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/credit-requests`, {
      farmerId,
      campaignId,
      hectareNumber,
      creditReason,
      creditAmount,
      guaranteeDescription,
      guaranteeAmount,
      technicalId,
      creditRequestObservation
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.data
    
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}