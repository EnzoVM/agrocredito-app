import axios from 'axios'
import { checkAuthorization } from './check.authorization.service'

export async function listDepartureDetailService ({
  deliveryPlanModelId
}:{
  deliveryPlanModelId: number
}): Promise<{
  departureDetailId: number,
  deliveryPlanModelId: number,
  departureDetailDescription: string,
  departureType: string,
  resource: string,
  amountPerHectare: number
}[]> {

  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/departure-detail/list/${deliveryPlanModelId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.data
    
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}


export async function deleteDepartureDetailService ({
  departureDetailId
}:{
  departureDetailId: number
}): Promise<{
  departureDetailId: number,
  deliveryPlanModelId: number,
  departureDetailDescription: string,
  departureType: string,
  resource: string,
  amountPerHectare: number
}> {

  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/departure-detail/${departureDetailId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.data
    
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

export async function createDepartureDetailService ({
  deliveryPlanModelId,
  departureDetailDescription,
  departureType,
  amountPerHectare
}:{
  deliveryPlanModelId: number
  departureDetailDescription: string,
  departureType: string,
  amountPerHectare: number
}): Promise<{
  departureDetailId: number,
  deliveryPlanModelId: number,
  departureDetailDescription: string,
  departureType: string,
  resource: string,
  amountPerHectare: number
}> {

  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/departure-detail`, {
      deliveryPlanModelId,
      departureDetailDescription,
      departureType,
      amountPerHectare
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

export async function listDepatureDetailByCampaignIdService ({
  campaignId
}:{
  campaignId: string
}): Promise<{
  departureDetailId: number,
  deliveryPlanModelId: number,
  departureDetailDescription: string,
  departureType: string,
  resource: string,
  amountPerHectare: number
}[]> {
  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/departure-detail/list/bycampaing/${campaignId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    return response.data.data

  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}
