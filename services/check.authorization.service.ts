import { generateAccessTokenService, verifyAccessTokenService } from "./auth.service"
import { setCookie, getCookie } from 'cookies-next'

export const checkAuthorization = async (): Promise<{
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