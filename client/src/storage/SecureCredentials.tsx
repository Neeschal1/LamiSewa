import * as SecureStore from "expo-secure-store";

export const saveData = async (data: any) => {
  try {
    await SecureStore.setItemAsync("userdata", JSON.stringify(data));
  } catch (err) {
    console.log(err);
  }
};

export const getData = async () => {
  try {
    const data = await SecureStore.getItemAsync("userdata");
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const deleteData = async () => {
  try {
    await SecureStore.deleteItemAsync("userdata");
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const saveJsonData = async (key: string, value: any) => {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  } catch (err) {
    console.log(err);
  }
};

export const getJsonData = async (key: string) => {
  try {
    const data = await SecureStore.getItemAsync(key);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const deleteJsonData = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (err) {
    console.log(err);
    return null;
  }
};
