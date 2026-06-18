import * as SecureStore from "expo-secure-store";

export const saveID = async (id: string) => {
  try {
    await SecureStore.setItemAsync("userid", id);
  } catch (err) {
    return err;
  }
};

export const getID = async () => {
  try {
    const id = await SecureStore.getItem("userid");
    return id;
  } catch (err) {
    return err;
  }
};

export const clearID = async () => {
  try {
    await SecureStore.deleteItemAsync("userid");
  } catch (err) {
    return `Deleting id unsuccessful :(, ${err}`
  }
};
