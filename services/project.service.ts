import axios from 'axios'
import { checkAuthorization } from './check.authorization.service'

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