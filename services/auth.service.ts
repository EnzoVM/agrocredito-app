export async function loginService({ email, password }: { email: string, password: string }): Promise<{
  isLoged: boolean,
  tokens: {
    accessToken: string,
    refreshToken: string
  }
}> {
  try {
    const responseString = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/login`, {
      body: JSON.stringify({
        email,
        password
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await responseString.json()

    console.log(response)

    if (response.statusCode === 200) {
      return {
        isLoged: true,
        tokens: {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        }
      }
    }

    return {
      isLoged: false,
      tokens: {
        accessToken: '',
        refreshToken: ''
      }
    }
  } catch (error: any) {
    return {
      isLoged: false,
      tokens: {
        accessToken: '',
        refreshToken: ''
      }
    }
  }
}

export async function generateAccessTokenService({ refreshToken }: { refreshToken: string }): Promise<{
  isLoged: boolean,
  tokens: {
    accessToken: string,
    refreshToken: string
  }
}> {
  try {
    const responseString = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/refresh-token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refreshToken=${refreshToken}`
      }
    })

    const response = await responseString.json()

    console.log(response)

    if (response.statusCode === 200) {
      return {
        isLoged: true,
        tokens: {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        }
      }
    }

    return {
      isLoged: false,
      tokens: {
        accessToken: '',
        refreshToken: ''
      }
    }
  } catch (error: any) {
    return {
      isLoged: false,
      tokens: {
        accessToken: '',
        refreshToken: ''
      }
    }
  }
}

export async function verifyAccessTokenService({ accessToken }: { accessToken: string }): Promise<{
  isValid: boolean
}> {
  try {
    const responseString = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/login-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `accessToken=${accessToken}`
      }
    })

    const response = await responseString.json()

    console.log(response)

    if (response.statusCode === 200) {
      return {
        isValid: true
      }
    }

    return {
      isValid: false
    }
  } catch (error: any) {
    console.log(error)
    return {
      isValid: false
    }
  }
}