import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { Button } from "@components/ui/Button";
import { Screen } from "@components/ui/Screen";
import { TextInputField } from "@components/ui/TextInputField";
import messages from "@constants/messages";
import { useAuth } from "@hooks/useAuth";
import { useToast } from "@hooks/useToast";
import { ApiError } from "@models/api";
import colors from "@theme/colors";

const logo = require("@assets/logo-kunde.png");

export function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error(messages.toast.errorTitle, "Ingresa usuario y contraseña.");
      return;
    }

    setSubmitting(true);
    try {
      await login({ username, password });
      toast.success(messages.toast.successTitle, messages.auth.loginSuccess);
    } catch (err) {
      toast.error(messages.toast.errorTitle, err instanceof ApiError ? err.message : messages.auth.loginError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen contentContainerStyle={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.title}>Kunde App</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formAccent} />
          <TextInputField
            autoCapitalize="none"
            label="Usuario"
            onChangeText={setUsername}
            placeholder="Usuario"
            value={username}
          />
          <TextInputField
            label="Contraseña"
            onChangeText={setPassword}
            placeholder="Tu contraseña"
            secureTextEntry
            value={password}
          />
          <Button title="Ingresar" onPress={handleLogin} loading={submitting} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 24,
    marginTop: -54,
    overflow: "hidden",
    paddingHorizontal: 22,
    paddingVertical: 26,
    shadowColor: colors.blue,
    shadowOpacity: 0.16,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
  },
  formAccent: {
    backgroundColor: colors.red,
    height: 4,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  header: {
    alignItems: "center",
    backgroundColor: colors.blueMid,
    justifyContent: "center",
    minHeight: 360,
    paddingBottom: 70,
    paddingHorizontal: 28,
    paddingTop: 50,
  },
  keyboard: {
    flex: 1,
  },
  logo: {
    height: 72,
    width: 150,
  },
  logoCircle: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 74,
    height: 148,
    justifyContent: "center",
    marginBottom: 18,
    shadowColor: colors.blueDeep,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    width: 148,
  },
  screen: {
    backgroundColor: colors.lightGray,
    flexGrow: 1,
    overflow: "hidden",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  subtitle: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 320,
    textAlign: "center",
  },
  title: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
