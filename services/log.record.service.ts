import axios from 'axios'

export async function createLogRecord ({
  resource,
  method,
  initRequestTime
}: {
  resource: string
  method: string
  initRequestTime: Date
}): Promise<{
  recordId: string
}> {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/log-record`, {
      resource,
      method,
      initRequestTime
    })

    return response.data.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

export async function setEndRequestTimeByLogRecordId ({
  recordId,
  endRequestTime
}: {
  recordId: string,
  endRequestTime: Date
}): Promise<void> {
  try {
    await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/log-record/${recordId}`, {
      endRequestTime
    })
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}