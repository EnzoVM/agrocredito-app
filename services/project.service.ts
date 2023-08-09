import axios from 'axios'
import { checkAuthorization } from './check.authorization.service'

interface ProjectListModel {
  projectId: number
  projectDescription: string
  sectorDescription: string
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


export async function deleteProjectService ({
  projectId
}:{
  projectId: number
}): Promise<string> {

  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/delete/${projectId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    return response.data.data

  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}


export async function listAllProjectService ({
  sectorId, 
  projectDescription, 
  page, 
  limit, 
  typeSearch
}:{
  sectorId: number, 
  projectDescription: string, 
  page: number, 
  limit: number, 
  typeSearch: 'all' | 'sector' | 'name' | 'both'
}): Promise<{projectList: ProjectListModel[], count: number}> {

  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const filters = JSON.stringify({
      sectorId, 
      projectDescription, 
      page, 
      limit, 
      typeSearch
    })

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/list/${filters}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    return response.data.data

  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

export async function createProjectService ({
  projectDescription,
  sectorId
}:{
  projectDescription: string,
  sectorId: number
}): Promise<string> {

  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/projects`, {
      projectDescription,
      sectorId
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.message

  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}