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

export async function listProjectBySectorService ({
  sectorId
}:{
  sectorId: number
}): Promise<{
      projectId: string
      projectDescription: string
      projectSectorId: number
      projectCode: number
    }[]> {
  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${sectorId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.data

  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

export async function listProjectService (): Promise<{
      projectId: string
      projectDescription: string
      projectSectorId: number
      projectCode: number
    }[]> {
  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/projects`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.data

  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}