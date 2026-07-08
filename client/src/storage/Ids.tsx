import * as SecureStore from "expo-secure-store";

export const saveData = async (data: any) => {
  try {
    await SecureStore.setItemAsync(
      "userdata",
      JSON.stringify(data)
    );
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

export const clearData = async () => {
  try {
    await SecureStore.deleteItemAsync("userid");
  } catch (err) {
    return `Deleting id unsuccessful :(, ${err}`
  }
};

export const saveDataString = async (data: string) => {
  try {
    await SecureStore.setItemAsync("usersid", data);
  } catch (err) {
    console.log(err);
  }
};

export const getDataString = async () => {
  try {
    const usersID = await SecureStore.getItemAsync("usersid");
    return usersID
  } catch (err) {
    console.log(err);
  }
};
