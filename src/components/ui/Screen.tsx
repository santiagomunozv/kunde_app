import { PropsWithChildren, ReactElement } from "react";
import { RefreshControlProps, ScrollView, StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@theme/colors";

type ScreenProps = PropsWithChildren<{
  contentContainerStyle?: ViewStyle;
  refreshControl?: ReactElement<RefreshControlProps>;
}>;

export function Screen({ children, contentContainerStyle, refreshControl }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={[styles.content, contentContainerStyle]} refreshControl={refreshControl}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 14,
  },
  safe: {
    backgroundColor: colors.lightGray,
    flex: 1,
  },
});
