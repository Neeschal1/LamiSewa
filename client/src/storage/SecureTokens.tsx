import * as SecureStore from 'expo-secure-store'

export const saveTokens = async(access: string, refresh: string) => {
    try {
        await SecureStore.setItemAsync('accessToken', access);
        await SecureStore.setItemAsync('refreshToken', refresh);
    } catch (err) {
        return err
    }
}

export const clearToken = async() => {
    try {
        await SecureStore.deleteItemAsync('accessToken')
        await SecureStore.deleteItemAsync('refreshToken')
    } catch (err) {
        return `${err}`
    }
}

export const getAccessTokens = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync("accessToken")
    return token
  } catch (err) {
    return `${err}`
  }
}

export const getRefreshTokens = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync("accessToken")
    return token
  } catch (err) {
    return `${err}`
  }
}