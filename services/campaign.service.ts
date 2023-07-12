import axios from 'axios'
import { checkAuthorization } from './check.authorization.service'

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
}): Promise<{ 
  campaignList: { 
    campaignId: string, 
    campaignDescription: string, 
    campaignTypeDescription: string, 
    periodName: string, 
    campaignYear: string, 
    startDate: string, 
    finishDate:string 
  }[], 
  count: number 
  }> {

  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
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
    throw new Error(error.response.data.message)
  }
}


export async function deleteCampaignService ({
  campaignId
}:{
  campaignId: string
}): Promise<string> {

  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
    }

    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/campaign/${campaignId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    return response.data.data

  } catch (error: any) {
    throw new Error(error.response.data.message)
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

  try {
    const { isLoged, accessToken } = await checkAuthorization()

    if (!isLoged) {
      throw new Error('You have to login again')
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
    throw new Error(error.response.data.message)
  }
}