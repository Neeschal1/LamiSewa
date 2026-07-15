import * as LocalAuthentication from "expo-local-authentication";
import CustomModal from "../components/CustomModal";

export const FingerPrintLogin = async () => {
  const compatible = await LocalAuthentication.hasHardwareAsync();

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) return;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Login using Fingerprint",
  });

//   if (!compatible) {
//     showModal();
//     return;
//   }

  if (result.success) {
    alert("Logged In");
  } else {
    alert("Authentication Failed");
  }
};
