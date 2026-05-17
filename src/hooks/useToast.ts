import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

type ShowToastParams = {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
};

export const useToast = () => {
  const showToast = ({ type, title, message, duration = 3000 }: ShowToastParams) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      visibilityTime: duration,
      topOffset: 60,
    });
  };

  return {
    success: (title: string, message?: string, duration?: number) => showToast({ type: "success", title, message, duration }),
    error: (title: string, message?: string, duration?: number) => showToast({ type: "error", title, message, duration }),
    info: (title: string, message?: string, duration?: number) => showToast({ type: "info", title, message, duration }),
    hide: () => Toast.hide(),
  };
};
