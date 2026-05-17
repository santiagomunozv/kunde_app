import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@components/ui/Screen";
import { useAgenda } from "@hooks/useAgenda";
import { AgendaEvent, ScheduleRequest } from "@models/agenda";
import { RootStackParamList } from "@navigation/types";
import colors from "@theme/colors";

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function RequestsPage() {
  const navigation = useNavigation<Navigation>();
  const { requests } = useAgenda();

  const openDetail = (request: ScheduleRequest) => {
    const event = buildEventFromRequest(request);
    if (!event) {
      return;
    }

    navigation.navigate("EventDetail", { event });
  };

  return (
    <Screen contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Solicitudes</Text>
        <Text style={styles.subtitle}>Historial de tus espacios solicitados</Text>
      </View>
      <View style={styles.scoop} />
      {requests.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aún no tienes solicitudes de agendamiento.</Text>
        </View>
      ) : (
        requests.map((request) => {
          const status = request.status || request.txEstadoSolicitudAgendamiento || "Pendiente";
          const eventName = request.eventName || request.txNombreEvento || "Evento";
          return (
            <Pressable key={request.id || request.oidSolicitudAgendamiento} onPress={() => openDetail(request)} style={styles.card}>
              <View style={[styles.cardBar, getBarStyle(status)]} />
              <View style={styles.cardHead}>
                <Text style={styles.name}>{eventName}</Text>
                <Text style={[styles.badge, getBadgeStyle(status)]}>{status}</Text>
              </View>
              <Text style={styles.meta}>
                {request.date || request.dtFechaSolicitudAgendamiento} · {request.startTime || request.hrHoraInicioSolicitudAgendamiento} - {request.endTime || request.hrHoraFinSolicitudAgendamiento}
              </Text>
              <Text style={styles.meta}>{request.modality || request.lsModalidadSolicitudAgendamiento}</Text>
            </Pressable>
          );
        })
      )}
    </Screen>
  );
}

function buildEventFromRequest(request: ScheduleRequest): AgendaEvent | null {
  const id = request.terceroEventoPeriodicidadId || request.TerceroEventoPeriodicidad_oidTerceroEventoPeriodicidad;
  const eventId = request.eventId || request.Evento_oidEvento;

  if (!id || !eventId) {
    return null;
  }

  const status = request.status || request.txEstadoSolicitudAgendamiento || "Pendiente";

  return {
    id,
    eventId,
    name: request.eventName || request.txNombreEvento || "Evento",
    modality: request.modality || request.lsModalidadSolicitudAgendamiento || "",
    estimatedDate: request.date || request.dtFechaSolicitudAgendamiento || null,
    estimatedTime: request.startTime || request.hrHoraInicioSolicitudAgendamiento || null,
    duration: request.duration || request.inDuracionSolicitudAgendamiento || 60,
    status: status === "Asignada" || status === "Reprogramada" ? "Asignado" : status === "Pendiente" ? "Solicitado" : status,
    statusLabel: status,
    canSchedule: false,
  };
}

function getBarStyle(status: string) {
  if (status === "Asignada" || status === "Confirmada") {
    return { backgroundColor: colors.blue };
  }
  if (status === "Rechazada" || status === "Cancelada") {
    return { backgroundColor: colors.red };
  }
  return { backgroundColor: colors.warning };
}

function getBadgeStyle(status: string) {
  if (status === "Asignada" || status === "Confirmada") {
    return styles.badgeConfirmed;
  }
  if (status === "Rechazada" || status === "Cancelada") {
    return styles.badgeDanger;
  }
  return styles.badgePending;
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 18,
    borderWidth: 1,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 4,
    textTransform: "uppercase",
  },
  badgeConfirmed: {
    backgroundColor: colors.blueSoft,
    borderColor: colors.blueTint,
    color: colors.blue,
  },
  badgeDanger: {
    backgroundColor: colors.redSoft,
    borderColor: "rgba(255,0,0,0.18)",
    color: colors.redDeep,
  },
  badgePending: {
    backgroundColor: colors.warningSoft,
    borderColor: "#F5D88A",
    color: "#7A5200",
  },
  card: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
    padding: 16,
    paddingTop: 18,
  },
  cardBar: {
    height: 4,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  cardHead: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  empty: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  emptyText: {
    color: colors.text,
    textAlign: "center",
  },
  meta: {
    color: colors.grayMid,
    fontSize: 12,
    marginTop: 6,
  },
  name: {
    color: colors.ink,
    flex: 1,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 22,
  },
  screen: {
    paddingBottom: 22,
  },
  header: {
    backgroundColor: colors.blueMid,
    marginHorizontal: -14,
    marginTop: -14,
    paddingBottom: 32,
    paddingHorizontal: 18,
    paddingTop: 28,
  },
  scoop: {
    backgroundColor: colors.lightGray,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    height: 20,
    marginHorizontal: -14,
    marginBottom: 16,
    marginTop: -12,
  },
  subtitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    marginTop: 2,
  },
  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "900",
  },
});
