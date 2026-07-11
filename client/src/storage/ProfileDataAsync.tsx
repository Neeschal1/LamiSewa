import AsyncStorage from "@react-native-async-storage/async-storage";
import { FC } from "react";
import { ProfileData } from "@/src/storage/AsyncDataComponents";

export const StoreStringDataAsync = async ( key: string, value: string ) => {
  try {
    await AsyncStorage.setItem(`${key}`, `${value}`);
  } catch (err) {
    return `${err}`;
  }
};

export const GetStringDataAsync = async ( key: string ) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null){
      return null;
    }
    return value;
  } catch (err) {
    console.log("Error: ", err)
    return `${err}`;
  }
};

export const DeleteStringDataAsync = async ( key: string ) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    return `${err}`;
  }
};



export const StoreObjectDataAsync: FC<ProfileData> = async ({ key, value }) => {
  try {
    const objData = JSON.stringify(value);
    await AsyncStorage.setItem(`${key}`, objData);
  } catch (err) {
    return `${err}`;
  }
};

export const GetObjectDataAsync: FC<ProfileData> = async ({ key }) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (err) {
    return err;
  }
};

export const RemoveDataAsync: FC<ProfileData> = async ({ key }) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    return `${err}`;
  }
};

export const FetchProfileState = async () => {
  try {
    const value = await AsyncStorage.getItem("ProfileData");
    return value === "true"
  } catch (err) {
    console.log("Error!", err)
    return false
  }
};
