import { View } from "react-native"
import { ErrorText } from "@/src/components/systemComponentsLayout"

export const toastConfig = {
  success: (props: any) => (
    <View className="bg-background items-center mt-[140px] px-6 py-2 justify-center rounded-full">
      <ErrorText text={props.text1} />
    </View>
  ),
}