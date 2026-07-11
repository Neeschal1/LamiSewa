import * as SecureStore from 'expo-secure-store'

export const saveTokens = async(token: string) => {
    try {
        await SecureStore.setItemAsync('accessToken', token)
    } catch (err) {
        return err
    }
}

export const getTokens = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync("accessToken")
    return token
  } catch (err) {
    return `${err}`
  }
}

export const clearToken = async() => {
    try {
        await SecureStore.deleteItemAsync('accessToken')
    } catch (err) {
        return "Deleting token unsuccessful :("
    }
}