import axios from 'axios'
import { checkAuthorization } from './check.authorization.service'

export async function listCampaignTypeService (): Promise<{
  campaignTypeId: number,
  campaignTypeDescription: string,
  periodQuantity: number
}[]> {

  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/campaign-type`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.data
    
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}