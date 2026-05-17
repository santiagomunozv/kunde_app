import { BaseToast, ErrorToast, ToastConfig } from "react-native-toast-message";
import colors from "@theme/colors";

export const toastConfig: ToastConfig = {
  success: (props) => <BaseToast {...props} style={{ borderLeftColor: colors.success }} text1NumberOfLines={2} text2NumberOfLines={3} />,
  error: (props) => <ErrorToast {...props} style={{ borderLeftColor: colors.danger }} text1NumberOfLines={2} text2NumberOfLines={3} />,
  info: (props) => <BaseToast {...props} style={{ borderLeftColor: colors.blue }} text1NumberOfLines={2} text2NumberOfLines={3} />,
};
