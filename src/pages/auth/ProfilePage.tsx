import { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import StorageService from "@api/StorageService";
import { Button } from "@components/ui/Button";
import { Screen } from "@components/ui/Screen";
import { config } from "@constants/config";
import endPoints from "@constants/endPoints";
import storageKeys from "@constants/storageKeys";
import { useAuth } from "@hooks/useAuth";
import colors from "@theme/colors";

export function ProfilePage() {
  const { client, user, logout } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [photoFailed, setPhotoFailed] = useState(false);

  useEffect(() => {
    StorageService.getValue(storageKeys.AUTH_TOKEN_KEY).then(setToken);
  }, []);

  const photoUrl = useMemo(() => {
    if (!client?.hasPhoto || !token || photoFailed) {
      return null;
    }

    return `${config.apiBaseUrl}${endPoints.app.auth.clientPhoto}`;
  }, [client?.hasPhoto, photoFailed, token]);

  const initials = useMemo(() => {
    const name = client?.name || user?.username || "K";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [client?.name, user?.username]);

  return (
    <Screen contentContainerStyle={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.avatarWrap}>
          {photoUrl ? (
            <Image
              source={{
                uri: photoUrl,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }}
              onError={() => setPhotoFailed(true)}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.avatarInitials}>{initials}</Text>
          )}
        </View>
        <Text style={styles.title}>{client?.name}</Text>
      </View>

      <View style={styles.panel}>
        <InfoRow label="Usuario" value={user?.username || client?.document || "Sin usuario"} />
        <InfoRow label="Correo" value={client?.email || "Sin correo"} />
      </View>

      <Button title="Cerrar sesión" onPress={logout} variant="secondary" />
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarImage: {
    height: "100%",
    width: "100%",
  },
  avatarInitials: {
    color: colors.blue,
    fontSize: 24,
    fontWeight: "900",
  },
  avatarWrap: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: "rgba(255,255,255,0.45)",
    borderRadius: 44,
    borderWidth: 4,
    height: 86,
    justifyContent: "center",
    marginBottom: 12,
    overflow: "hidden",
    width: 86,
  },
  hero: {
    alignItems: "center",
    backgroundColor: colors.blueMid,
    marginHorizontal: -14,
    marginTop: -14,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 34,
  },
  label: {
    color: colors.grayMid,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  panel: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: -18,
    marginBottom: 20,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  row: {
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  screen: {
    paddingBottom: 24,
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 30,
    textAlign: "center",
  },
  value: {
    color: colors.ink,
    fontSize: 16,
    marginTop: 4,
  },
});
