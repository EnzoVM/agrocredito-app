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
    throw new Error(error.response.data.message)
  }
}

export async function listFarmerAttributesServices (): Promise<{
  farmerQualities: { farmerQualityId: number, farmerQualityDescription: string }[]
  propertyLegalConditions: { propertyLegalConditionId: number, propertyLegalConditionDescription: string }[]
}> {
  try {

    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/farmers/attributes`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.data

  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

export async function createFramerService ({ 
  cadastralRegistry,
  farmerAddress,
  farmerProjectId,
  farmerQualityId,
  farmerType,
  propertyHectareQuantity,
  propertyLegalConditionId,
  propertyLocation,
  propertyProjectCode,
  propertySectorId,
  dni,
  fullNames,
  ruc,
  socialReason
}: { 
  propertySectorId: number   
  propertyProjectCode: number
  farmerQualityId: number
  farmerType: 'Individual' | 'Asociación'
  socialReason?: string
  fullNames?: string
  dni?: string
  ruc?: string
  propertyLocation: string
  propertyLegalConditionId: number
  cadastralRegistry: string
  farmerAddress: string
  farmerProjectId: number
  propertyHectareQuantity: number 
}): Promise<string> {
  try {

    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/farmers`, {
      cadastralRegistry,
      farmerAddress,
      farmerProjectId,
      farmerQualityId,
      farmerType,
      propertyHectareQuantity,
      propertyLegalConditionId,
      propertyLocation,
      propertyProjectCode,
      propertySectorId,
      dni,
      fullNames,
      ruc,
      socialReason
    },{
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.message

  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

export async function getFarmerDetailsService ({ id }: { id: string }): Promise<{
  farmerId: string                     
  propertySector: string   
  propertyProject: string
  correlative: number
  farmerQuality: string
  farmerType: 'Individual' | 'Asociación'
  socialReason?: string
  fullNames?: string
  dni?: string
  ruc?: string
  propertyLocation: string
  propertyLegalCondition: string
  cadastralRegistry: string
  farmerAddress: string
  farmerProject: string
  propertyHectareQuantity: number
}> {
  try {

    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/farmers/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.data

  } catch (error: any) {

    if (error.message) {
      throw new Error(error.message)
    }
    throw new Error(error.response.data.message)
  }
}

export async function updateFarmerService ({ 
  farmerId, 
  farmerAddress, 
  farmerProjectId, 
  hectareQuantity 
}: { 
  farmerId: string, 
  farmerAddress?: string, 
  farmerProjectId?: number, 
  hectareQuantity?: number 
}): Promise<string> {
  try {

    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/farmers/${farmerId}`, {
      farmerAddress,
      farmerProjectId,
      hectareQuantity
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.data

  } catch (error: any) {

    if (error.message) {
      throw new Error(error.message)
    }
    throw new Error(error.response.data.message)
  }
}