export async function loginService({ email, password }: { email: string, password: string }): Promise<{
  isLoged: boolean,
  tokens: {
    accessToken: string,
    refreshToken: string
  }
}> {
  try {
    const responseString = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
      body: JSON.stringify({
        email,
        password
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    })

    const response = await responseString.json()

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
    const responseString = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`
      },
      mode: 'cors'
    })

    const response = await responseString.json()

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
    const responseString = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      mode: 'cors'
    })

    const response = await responseString.json()

    if (response.statusCode === 200) {
      return {
        isValid: true
      }
    }

    return {
      isValid: false
    }
  } catch (error: any) {
    return {
      isValid: false
    }
  }
}