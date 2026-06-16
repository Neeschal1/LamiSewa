import * as SecureStore from 'expo-secure-store'

export const saveID = async(id: string) => {
    await SecureStore.setItemAsync('userid', id)
}

export const getID = async() => {
    const id = await SecureStore.getItem('userid')
    return id ? id : null
}

export const clearID = async() => {
    await SecureStore.deleteItemAsync('userid')
}