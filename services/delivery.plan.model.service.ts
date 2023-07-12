import axios from 'axios'
import { verifyAccessTokenService, generateAccessTokenService } from './auth.service'
import { setCookie, getCookie } from 'cookies-next'

export async function getDeliveryPlanModelService ({campaignId}:{campaignId: string}): Promise<{
  deliveryPlanModelId: number,
  campaignId: string,
  deliveryPlanModelDescription: string
}> {

  let accessToken = getCookie('accessToken') as string
  const refreshToken = getCookie('refreshToken') as string
  
  if(!accessToken || !refreshToken ){
    throw new Error('You have to login again')
  }

  try {
    const statusAccessToken = await verifyAccessTokenService({accessToken})

    if(!statusAccessToken.isValid){
      const newAccessToken = await generateAccessTokenService({refreshToken})

      if(!newAccessToken.isLoged) {
        throw new Error('You have to login again')
      }else {
        setCookie('accessToken', newAccessToken.tokens.accessToken)
        setCookie('refreshToken', newAccessToken.tokens.refreshToken)

        accessToken = newAccessToken.tokens.accessToken
      }
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/delivery-plan-model/list/${campaignId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    
    return response.data.data
    
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}


export async function deleteDeliveryPlanModelService ({deliveryPlanModelId}:{deliveryPlanModelId: number}): Promise<string> {

  let accessToken = getCookie('accessToken') as string
  const refreshToken = getCookie('refreshToken') as string
  
  if(!accessToken || !refreshToken ){
    throw new Error('You have to login again')
  }

  try {
    const statusAccessToken = await verifyAccessTokenService({accessToken})

    if(!statusAccessToken.isValid){
      const newAccessToken = await generateAccessTokenService({refreshToken})

      if(!newAccessToken.isLoged) {
        throw new Error('You have to login again')
      }else {
        setCookie('accessToken', newAccessToken.tokens.accessToken)
        setCookie('refreshToken', newAccessToken.tokens.refreshToken)

        accessToken = newAccessToken.tokens.accessToken
      }
    }

    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/delivery-plan-model/${deliveryPlanModelId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    
    return response.data.message
    
  } catch (error: any) {
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

  let accessToken = getCookie('accessToken') as string
  const refreshToken = getCookie('refreshToken') as string
  
  if(!accessToken || !refreshToken ){
    throw new Error('You have to login again')
  }

  try {
    const statusAccessToken = await verifyAccessTokenService({accessToken})

    if(!statusAccessToken.isValid){
      const newAccessToken = await generateAccessTokenService({refreshToken})

      if(!newAccessToken.isLoged) {
        throw new Error('You have to login again')
      }else {
        setCookie('accessToken', newAccessToken.tokens.accessToken)
        setCookie('refreshToken', newAccessToken.tokens.refreshToken)

        accessToken = newAccessToken.tokens.accessToken
      }
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
    throw new Error(error.response.data.message)
  }
}