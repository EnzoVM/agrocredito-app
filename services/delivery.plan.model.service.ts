import axios from 'axios'
import { checkAuthorization } from './check.authorization.service'

export async function getDeliveryPlanModelService ({campaignId}:{campaignId: string}): Promise<{
  deliveryPlanModelId: number,
  campaignId: string,
  deliveryPlanModelDescription: string
}> {

  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/delivery-plan-model/list/${campaignId}`, {
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


export async function deleteDeliveryPlanModelService ({
  deliveryPlanModelId
}:{
  deliveryPlanModelId: number
}): Promise<string> {

  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/delivery-plan-model/${deliveryPlanModelId}`, {
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


export async function createDeliveryPlanModelService ({
  campaignId, 
  deliveryPlanModelDescription 
}:{
  campaignId: string, 
  deliveryPlanModelDescription: string
}): Promise<{
  deliveryPlanModelId: number,
  campaignId: string,
  deliveryPlanModelDescription: string
}> {

  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/delivery-plan-model`, {
      campaignId,
      deliveryPlanModelDescription
    }, {
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