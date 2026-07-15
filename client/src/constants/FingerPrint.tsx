import * as LocalAuthentication from "expo-local-authentication";
import CustomModal from "../components/CustomModal";
import HandleFingerPrintLoginVerification from "../services/accounts/fingerprintLogin";
import { GetStringDataAsync } from "../storage/ProfileDataAsync";

const FingerPrintLogin = async (login: (token: string) => Promise<void>) => {
  const compatible = await LocalAuthentication.hasHardwareAsync();

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) return;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Login using Fingerprint",
  });

  if (!compatible) {
    alert("This device doesn't support biometrics.");
    return;
  }

  if (!enrolled) {
    alert("No fingerprint or face ID is enrolled.");
    return;
  }

  //   if (!compatible) {
  //     showModal();
  //     return;
  //   }

  if (result.success) {
    const useremail = await GetStringDataAsync("UserEmail");
    const fingerPrintLoginService = await HandleFingerPrintLoginVerification(useremail);
    const token = fingerPrintLoginService["data"]["Tokens"]["accesstoken"];
    await login(token);
  } else {
    alert("Authentication Failed");
  }
};

export default FingerPrintLogin;
