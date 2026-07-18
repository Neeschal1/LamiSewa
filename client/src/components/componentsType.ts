import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ReactNode } from "react";
import { KeyboardTypeOptions } from "react-native";

export type RootStackParamList = {
  // initials
  Login: undefined;
  Splash: undefined;
  Welcome: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  OtpVerification: undefined;
  Password: undefined;
  SetNewPassword: undefined;
  SignupVerification: undefined;  
  
  // mains
  Chats: undefined;
  Home: undefined;
  Notification: undefined;
  Profile: undefined;
  Search: undefined; 

  // profile
  UserInfo: undefined;
  BasicInfo: undefined;
  AdditionalInfo: undefined;
  CareerInfo: undefined;
  HobbiesInfo: undefined;
  PersonalInfo: undefined;
  CasualInfo: undefined;
  
  // Payment
  PaymentSuccess: undefined,
  SubscriptionDetails: undefined,
  
  // Mains
  MyTabs: undefined;
  NearYou: undefined;
  
  // Accounts
  AccountPassword: undefined;
  
  // Id Verification
  BasicDetails: undefined;
  Documents: undefined;
  FacialVerification: undefined;
  FinalVerification: undefined;
  Intro: undefined;
  Verify: undefined;
  
  // Others
  FeaturedPhoto: undefined;
  ChangePassword: undefined;
  ContactUs: undefined;
  EditProfile: undefined;
  Help: undefined; 
  // Language: undefined;
  MatchedUsers: undefined;
  PrivacyPolicy: undefined;
  TermsOfUse: undefined;
  VerifyId: undefined;

  // Extras
  OnboardingScreen: undefined;
  CreateProfile: undefined;
  Language: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export interface TextProps {
  text: string | number;
}

export interface ButtonProps {
  text: string | number;
  action?: () => void;
  screen?: keyof RootStackParamList;
  disability?: boolean;
}

export interface SocialButtonProps {
  btnname: string;
  text: string | number;
  action?: () => void;
  logo?: undefined;
}

export interface GradientInputWrapperProps {
  children: ReactNode;
  hasText?: boolean;
}

export interface InputFieldProps {
  plchldr: string | undefined;
  state: string;
  setState: (text: string ) => void;
  board?: KeyboardTypeOptions;
}

export interface InputPasswordProps {
  plchldr: string | undefined;
  state: string;
  setState: (text: string ) => void;
  board?: KeyboardTypeOptions;
  visibility: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface OTPInputProps {
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface DOBInputProps {
  dob: {
    day: string;
    month: string;
    year: string;
  };
  setDob: React.Dispatch<
    React.SetStateAction<{
      day: string;
      month: string;
      year: string;
    }>
  >;
}

export interface DropdownItem {
  label: string;
  value: string;
}

export interface CustomDropdownProps {
  open: boolean;
  value: string | null;
  items: DropdownItem[];

  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  setItems: React.Dispatch<React.SetStateAction<DropdownItem[]>>;
}

export interface ShowCustomModal {
  showSuccessModal: boolean
}