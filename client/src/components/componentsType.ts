export interface TextProps {
  text: string | number;
}

export type RootStackParamList = {
  // initials
  Login: undefined;

  // mains

  // profile
};

export interface ButtonProps {
  text: string | number;
  action?: () => void;
  screen?: keyof RootStackParamList;
}