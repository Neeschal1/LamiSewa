import * as LocalAuthentication from "expo-local-authentication";
import HandleFingerPrintLoginVerification from "../services/accounts/fingerprintLogin";
import { GetStringDataAsync } from "../storage/ProfileDataAsync";
import { saveAuthTokens } from "../storage/SecureTokens";

type LoginFn = (
  accessToken: string,
  refreshToken?: string | null,
  hasProfile?: boolean | null
) => Promise<void>;

const FingerPrintLogin = async (login: LoginFn) => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) {
    alert("This device doesn't support biometrics.");
    return;
  }
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) {
    alert("No fingerprint or face ID is enrolled.");
    return;
  }
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Login using Fingerprint",
  });
  if (!result.success) {
    alert("Authentication Failed");
    return;
  }
  const useremail = await GetStringDataAsync("UserEmail");
  const session = await HandleFingerPrintLoginVerification(useremail);
  await saveAuthTokens(session.accessToken, session.refreshToken);
  await login(session.accessToken, session.refreshToken, session.hasProfile);
};

export default FingerPrintLogin;
