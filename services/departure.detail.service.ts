import axios from 'axios'
import { verifyAccessTokenService, generateAccessTokenService } from './auth.service'
import { setCookie, getCookie } from 'cookies-next'

export async function listDepartureDetailService ({deliveryPlanModelId}:{deliveryPlanModelId: number}): Promise<{
  departureDetailId: number,
  deliveryPlanModelId: number,
  departureDetailDescription: string,
  departureType: string,
  resource: string,
  amountPerHectare: number
}[]> {

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

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/departure-detail/list/${deliveryPlanModelId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.data
    
  } catch (error: any) {
    throw new Error(error.message)
  }
}


export async function deleteDepartureDetailService ({departureDetailId}:{departureDetailId: number}): Promise<{
  departureDetailId: number,
  deliveryPlanModelId: number,
  departureDetailDescription: string,
  departureType: string,
  resource: string,
  amountPerHectare: number
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

    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/departure-detail/${departureDetailId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.data
    
  } catch (error: any) {
    throw new Error(error.message)
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