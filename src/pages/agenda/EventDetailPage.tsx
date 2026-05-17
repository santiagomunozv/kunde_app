import { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import ApiServiceFetch from "@api/ApiServiceFetch";
import { Screen } from "@components/ui/Screen";
import endPoints from "@constants/endPoints";
import messages from "@constants/messages";
import { useToast } from "@hooks/useToast";
import { ApiError } from "@models/api";
import { AgendaEventDetail } from "@models/agenda";
import { RootStackParamList } from "@navigation/types";
import { endpoint } from "@utils/routes";
import colors from "@theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "EventDetail">;

export function EventDetailPage({ navigation, route }: Props) {
  const { event } = route.params;
  const toast = useToast();
  const [detail, setDetail] = useState<AgendaEventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDetail() {
      setLoading(true);
      setError(null);
      try {
        const response = await ApiServiceFetch.get<AgendaEventDetail>({
          url: endpoint(endPoints.app.agenda.eventDetail, { id: event.id }),
        });

        if (active) {
          setDetail(response);
        }
      } catch (err) {
        const message = err instanceof ApiError ? err.message : messages.errors.generic;
        if (active) {
          setError(message);
        }
        toast.error(messages.toast.errorTitle, message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDetail();

    return () => {
      active = false;
    };
  }, [event.id]);

  const request = detail?.activeRequest;
  const meeting = detail?.meeting;

  return (
    <Screen contentContainerStyle={styles.screen}>
      <View style={styles.hero}>
        <Pressable onPress={navigation.goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" color={colors.white} size={22} />
        </Pressable>
        <Text style={styles.tag}>{detail?.statusLabel || event.statusLabel || event.status}</Text>
        <Text style={styles.title}>{detail?.name || event.name}</Text>
      </View>
      <View style={styles.scoop} />

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={colors.blue} />
          <Text style={styles.loadingText}>Cargando detalle...</Text>
        </View>
      ) : error ? (
        <View style={styles.panel}>
          <Text style={styles.value}>{error}</Text>
        </View>
      ) : (
        <>
          {request ? (
            <View style={styles.panel}>
              <View style={styles.panelHead}>
                <Text style={styles.panelKicker}>Estado actual</Text>
                <Text style={styles.panelTitle}>Solicitud</Text>
              </View>
              <DetailRow label="Fecha" value={request.date} />
              <DetailRow label="Hora" value={`${request.startTime} - ${request.endTime}`} />
              <DetailRow label="Modalidad" value={request.modality} />
              <DetailRow label="Estado" value={request.status} />
              <DetailRow label="Observación" value={request.observation || "Sin observación"} />
            </View>
          ) : null}

          {meeting ? (
            <View style={styles.panel}>
              <View style={styles.panelHead}>
                <Text style={styles.panelKicker}>Asignación</Text>
                <Text style={styles.panelTitle}>Reunión</Text>
              </View>
              <DetailRow label="Gestor" value={meeting.manager?.name || "Pendiente por asignar"} />
              <DetailRow label="Fecha" value={meeting.date} />
              <DetailRow label="Hora" value={`${meeting.startTime} - ${meeting.endTime}`} />
              <DetailRow label="Modalidad" value={meeting.modality} />
              <DetailRow label="Ubicación/link" value={meeting.location || "Pendiente"} />
              <DetailRow label="Descripción" value={meeting.description || "Sin descripción"} />
            </View>
          ) : null}

          {!request && !meeting ? (
            <View style={styles.panel}>
              <Text style={styles.value}>Aún no hay detalle de solicitud o reunión para este evento.</Text>
            </View>
          ) : null}
        </>
      )}
    </Screen>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    marginBottom: 14,
    width: 36,
  },
  hero: {
    backgroundColor: colors.blueMid,
    marginHorizontal: -14,
    marginTop: -14,
    paddingBottom: 26,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: colors.redSoft,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    borderWidth: 1,
    color: colors.white,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textTransform: "uppercase",
  },
  label: {
    color: colors.grayMid,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  loadingBox: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    padding: 16,
  },
  loadingText: {
    color: colors.text,
    fontWeight: "700",
  },
  panel: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 14,
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  panelHead: {
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    marginHorizontal: -16,
    marginBottom: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  panelKicker: {
    color: colors.grayMid,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.6,
    marginBottom: 3,
    textTransform: "uppercase",
  },
  panelTitle: {
    color: colors.blue,
    fontSize: 18,
    fontWeight: "900",
  },
  row: {
    borderTopColor: colors.line,
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  scoop: {
    backgroundColor: colors.lightGray,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    height: 20,
    marginHorizontal: -14,
    marginTop: -10,
  },
  screen: {
    paddingBottom: 22,
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 29,
  },
  value: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 21,
  },
});
