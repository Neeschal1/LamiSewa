export interface TextProps {
  text: string | number;
}

export interface ButtonProps {
  text: string | number;
  action?: () => void;
}