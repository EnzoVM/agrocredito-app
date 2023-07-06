import axios from 'axios'
import { verifyAccessTokenService, generateAccessTokenService } from './auth.service'
import { setCookie, getCookie } from 'cookies-next'

const checkAuthorization = async (): Promise<{
  isLoged: boolean
  accessToken: string
}> => {
  let accessToken = getCookie('accessToken') as string
  const refreshToken = getCookie('refreshToken') as string
  
  if(!accessToken || !refreshToken ){
    return {
      isLoged: false,
      accessToken: ''
    }
  }

  try {
    const statusAccessToken = await verifyAccessTokenService({accessToken})

    if(!statusAccessToken.isValid){
      const newAccessToken = await generateAccessTokenService({refreshToken})

      if(!newAccessToken.isLoged) {
        return {
          isLoged: false,
          accessToken: ''
        }
      }else {
        setCookie('accessToken', newAccessToken.tokens.accessToken)
        setCookie('refreshToken', newAccessToken.tokens.refreshToken)

        accessToken = newAccessToken.tokens.accessToken
        return {
          isLoged: true,
          accessToken
        }
      }
    }

    return {
      isLoged: true,
      accessToken
    }
  } catch (error: any) {
    return {
      isLoged: false,
      accessToken: ''
    }
  }
}

export async function listFarmerService ({
  searchType,
  farmerId,
  farmerFullNames,
  farmerSocialReason,
  farmerType,
  page,
  limit
}:{
  searchType: 'code' | 'name'
  farmerId: string
  farmerFullNames: string
  farmerSocialReason: string
  farmerType: 'Individual' | 'Asociación'
  page: number, 
  limit: number,
}): Promise<{ 
    farmers: { 
      farmerId: string
      farmerQualityDescription: string
      farmerType: string
      socialReason?: string
      fullNames?: string
      dni?: string
      ruc?: string 
    }[], 
    count: number 
  }> {
  try {

    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const jsonFilter = JSON.stringify({
      searchType,
      farmerId,
      farmerFullNames,
      farmerSocialReason,
      farmerType,
      page,
      limit
    })

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/farmers/list/${jsonFilter}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.data

  } catch (error: any) {
    throw new Error(error.message)
  }
}