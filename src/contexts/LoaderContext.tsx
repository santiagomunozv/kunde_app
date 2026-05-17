import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import colors from "@theme/colors";

type LoaderContextValue = {
  loading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
};

const LoaderContext = createContext<LoaderContextValue | undefined>(undefined);

export function LoaderProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(false);

  const showLoader = useCallback(() => setLoading(true), []);
  const hideLoader = useCallback(() => setLoading(false), []);

  const value = useMemo(() => ({ loading, showLoader, hideLoader }), [loading, showLoader, hideLoader]);

  return (
    <LoaderContext.Provider value={value}>
      {children}
      {loading ? (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : null}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader debe usarse dentro de LoaderProvider");
  }

  return context;
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 100,
  },
});
