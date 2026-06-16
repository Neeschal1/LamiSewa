import * as SecureStore from 'expo-secure-store'

export const saveTokens = async(token: string) => {
    await SecureStore.setItemAsync('accessToken', token)
}

export const getTokens = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync("accessToken")
}

export const clearToken = async() => {
    await SecureStore.deleteItemAsync('accessToken')
}