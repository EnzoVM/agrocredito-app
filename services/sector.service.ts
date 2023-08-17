import axios from 'axios'
import { checkAuthorization } from './check.authorization.service'

interface SectorListModel {
  sectorId: number
  sectorDescription: string
}

export async function getAllSectors (): Promise<SectorListModel[]> {
  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sectors`, {
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

export async function listAllSectorsService ({
  sectorDescription, 
  page, 
  limit, 
  typeSearch
}:{
  sectorDescription: string, 
  page: number, 
  limit: number, 
  typeSearch: 'all' | 'sector' | 'name' | 'both'
}): Promise<{sectorList: SectorListModel[], count: number}> {

  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const filters = JSON.stringify({
      sectorDescription, 
      page, 
      limit, 
      typeSearch
    })

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sectors/list/${filters}`, {
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

export async function deleteSectorService ({
  sectorId
}:{
  sectorId: number
}): Promise<string> {

  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/sectors/${sectorId}`, {
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

export async function createSectorService ({
  sectorDescription
}:{
  sectorDescription: string
}): Promise<string> {

  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/sectors`, {
      sectorDescription
    }, {
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