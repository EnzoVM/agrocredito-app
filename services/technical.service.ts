import axios from 'axios'
import { checkAuthorization } from './check.authorization.service'

export async function listTechnicalByAssistanceTypeService ({
  assistanceTypeId
}:{
  assistanceTypeId:number
}): Promise<{
  technicalId: number, 
  assistanceTypeDescription: string, 
  technicalName: string
}[]> {
  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/technical/${assistanceTypeId}`, {
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
