import axios from 'axios'
import { verifyAccessTokenService, generateAccessTokenService } from './auth.service'
import { setCookie, getCookie } from 'cookies-next'

export async function listCampaignService ({
  filter, 
  page, 
  limit, 
  typeSearch
}:{
  filter: string, 
  page: number, 
  limit: number, 
  typeSearch: 'code' | 'year' | 'all'
}): Promise<{ campaignList: { campaignId: string, campaignDescription: string, campaignTypeDescription: string, periodName: string, campaignYear: string, startDate: string, finishDate:string }[], count: number }> {

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

    const json = JSON.stringify({filter, page, limit, typeSearch})

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/campaign/list/${json}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log(response.data.data);
    
    return response.data.data

  } catch (error: any) {
    throw new Error(error.message)
  }
}


export async function deleteCampaignService ({campaignId}:{campaignId: string}): Promise<string> {

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

    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/campaign/${campaignId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.data

  } catch (error: any) {
    throw new Error(error.message)
  }
}


export async function createCampaignService ({
  campaignDescription, 
  campaignTypeId, 
  campaignYear,
  startDate, 
  finishDate
}:{
  campaignDescription: string,
  campaignTypeId: number,
  campaignYear: string,
  startDate: string,
  finishDate: string
}): Promise<string> {

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

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/campaign`, {
      campaignDescription, 
      campaignTypeId, 
      campaignYear,
      startDate, 
      finishDate
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.message
    
  } catch (error: any) {
    throw new Error(error.message)
  }
}