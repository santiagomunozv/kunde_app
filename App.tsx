import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainNavigator from "@navigation/MainNavigator";
import { AuthProvider } from "@contexts/AuthContext";
import { LoaderProvider } from "@contexts/LoaderContext";
import { toastConfig } from "@components/ui/ToastConfig";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LoaderProvider>
          <MainNavigator />
          <Toast config={toastConfig} />
          <StatusBar style="dark" />
        </LoaderProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
