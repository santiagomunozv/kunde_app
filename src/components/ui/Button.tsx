import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import colors from "@theme/colors";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  disabled?: boolean;
};

export function Button({ title, onPress, variant = "primary", loading = false, disabled = false }: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        isDisabled ? styles.disabled : null,
        pressed ? styles.pressed : null,
      ]}
    >
      {loading ? <ActivityIndicator color={variant === "primary" ? colors.white : colors.blue} /> : <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: 13,
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  disabled: {
    opacity: 0.55,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  ghostText: {
    color: colors.blue,
  },
  pressed: {
    opacity: 0.82,
  },
  primary: {
    backgroundColor: colors.red,
    shadowColor: colors.red,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  primaryText: {
    color: colors.white,
  },
  secondary: {
    backgroundColor: colors.white,
    borderColor: colors.blue,
    borderWidth: 1.5,
  },
  secondaryText: {
    color: colors.blue,
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});
