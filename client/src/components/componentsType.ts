import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ReactNode } from "react";
import { KeyboardTypeOptions } from "react-native";

export type RootStackParamList = {
  // initials
  Login: undefined;
  Splash: undefined;
  Welcome: undefined;
  Signup: undefined;
  ForgetPassword: undefined;
  OtpVerification: undefined;
  Password: undefined;
  SetNewPassword: undefined;
  SignupVerification: undefined;  
  
  // mains
  
  // profile
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export interface TextProps {
  text: string | number;
}

export interface ButtonProps {
  text: string | number;
  action?: () => void;
  screen?: keyof RootStackParamList;
}

export interface SocialButtonProps {
  btnname: string;
  text: string | number;
  action?: () => void;
  logo?: undefined
}

export interface GradientInputWrapperProps {
  children: ReactNode;
  hasText?: boolean;
}

export interface InputFieldProps {
  plchldr: string;
  state: string;
  setState: (text: string ) => void;
  board?: KeyboardTypeOptions;
}