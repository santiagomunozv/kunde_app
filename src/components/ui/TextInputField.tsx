import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import colors from "@theme/colors";

type TextInputFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function TextInputField({ label, error, style, ...props }: TextInputFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 6,
  },
  input: {
    backgroundColor: colors.lightGray,
    borderColor: colors.line,
    borderRadius: 11,
    borderWidth: 1.5,
    color: colors.ink,
    fontSize: 14,
    height: 46,
    paddingHorizontal: 14,
  },
  inputError: {
    borderColor: colors.danger,
  },
  label: {
    color: colors.ink,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  wrapper: {
    marginBottom: 16,
  },
});
