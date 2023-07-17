import axios from 'axios'
import { checkAuthorization } from './check.authorization.service'

export async function listCreditRequestService ({ 
  farmerType,
  creditRequestStatus,
  farmerFullNames,
  farmerSocialReason,
  page,
  limit
}: {
  farmerType: 'Individual' | 'Asociación', 
  creditRequestStatus?: 'Aprobado' | 'Pendiente' | 'Rechazado', 
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

    const jsonFilter = JSON.stringify({
      farmerType,
      creditRequestStatus,
      farmerFullNames,
      farmerSocialReason,
      page,
      limit
    })

    // const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/farmers/list/${jsonFilter}`, {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`
    //   }
    // })
    
    // return response.data.data

    return {
      "creditRequests": [
          {
            "creditRequestId": "0364e36e-24b5-11ee-84bf-0ed08c7979f9",
            "campaignId": "ARR012023",
            "fullNames": "Josué Emmanuel Medina García",
            "creditAmount": 1000,
            "createDateTime": new Date(),
            "creditRequestStatus": "Pendiente"
          },
          {
            "creditRequestId": "04154924-24b5-11ee-84bf-0ed08c7979f9",
            "campaignId": "ARR012023",
            "fullNames": "Josué Emmanuel Medina García",
            "creditAmount": 1000,
            "createDateTime": new Date(),
            "creditRequestStatus": "Pendiente"
          },
          {
            "creditRequestId": "04b24c87-24b5-11ee-84bf-0ed08c7979f9",
            "campaignId": "ARR012023",
            "fullNames": "Josué Emmanuel Medina García",
            "creditAmount": 1000,
            "createDateTime": new Date(),
            "creditRequestStatus": "Pendiente"
          }
      ],
      "count": 3
  }

  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}