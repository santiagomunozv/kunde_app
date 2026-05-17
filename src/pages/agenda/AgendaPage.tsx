import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { Button } from "@components/ui/Button";
import { Screen } from "@components/ui/Screen";
import { useAgenda } from "@hooks/useAgenda";
import { AgendaEvent } from "@models/agenda";
import { RootStackParamList } from "@navigation/types";
import colors from "@theme/colors";

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function AgendaPage() {
  const navigation = useNavigation<Navigation>();
  const { summary, events, loading, load } = useAgenda();
  const visibleEvents = events.filter((event) => ["Pendiente", "Solicitado", "Asignado"].includes(event.status));

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const schedule = (event: AgendaEvent) => {
    navigation.navigate("Schedule", { event });
  };

  const openDetail = (event: AgendaEvent) => {
    navigation.navigate("EventDetail", { event });
  };

  return (
    <Screen contentContainerStyle={styles.screen} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}>
      <View style={styles.header}>
        <Text style={styles.title}>Agenda</Text>
        <Text style={styles.dateLabel}>{getMonthLabel()}</Text>
      </View>
      <View style={styles.scoop} />

      <View style={styles.summaryGrid}>
        <SummaryItem label="Contratadas" value={summary?.hours.contracted ?? 0} />
        <SummaryItem label="Disponibles" value={summary?.hours.available ?? 0} />
        <SummaryItem label="Solicitadas" value={summary?.hours.requested ?? 0} />
        <SummaryItem label="Confirmadas" value={summary?.hours.confirmed ?? 0} />
      </View>

      <Text style={styles.sectionTitle}>Eventos de tu agenda</Text>

      {visibleEvents.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No hay eventos disponibles para agendar.</Text>
        </View>
      ) : (
        visibleEvents.map((event) => (
          <Pressable key={event.id} onPress={() => (event.canSchedule ? undefined : openDetail(event))} style={styles.card}>
            <View style={[styles.cardStripe, getStripeStyle(event)]} />
            <View style={styles.cardHeader}>
              <Text style={styles.eventName}>{event.name}</Text>
              <Text style={[styles.badge, getBadgeStyle(event)]}>{event.statusLabel || event.status}</Text>
            </View>
            <Text style={styles.meta}>{event.modality || "Modalidad por definir"}</Text>
            <Text style={styles.meta}>Duración: {event.duration} min</Text>
            <View style={styles.action}>
              <Button
                title={event.canSchedule ? "Ver disponibilidad" : "Ver detalle"}
                onPress={() => (event.canSchedule ? schedule(event) : openDetail(event))}
                variant={event.canSchedule ? "primary" : "secondary"}
              />
            </View>
          </Pressable>
        ))
      )}
    </Screen>
  );
}

function getMonthLabel() {
  const now = new Date();
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  return `${months[now.getMonth()]} ${now.getFullYear()}`;
}

function getStripeStyle(event: AgendaEvent) {
  if (event.status === "Asignado") {
    return { backgroundColor: colors.blue };
  }
  if (event.status === "Solicitado") {
    return { backgroundColor: colors.warning };
  }
  return { backgroundColor: colors.success };
}

function getBadgeStyle(event: AgendaEvent) {
  if (event.status === "Asignado") {
    return styles.badgeConfirmed;
  }
  if (event.status === "Solicitado") {
    return styles.badgePending;
  }
  return styles.badgeReady;
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    marginTop: 12,
  },
  badge: {
    borderRadius: 20,
    borderWidth: 1,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 4,
    textTransform: "uppercase",
  },
  badgeConfirmed: {
    backgroundColor: "#EEF1FF",
    borderColor: "#B7C0FF",
    color: colors.blue,
  },
  badgePending: {
    backgroundColor: colors.warningSoft,
    borderColor: "#F5D88A",
    color: "#7A5200",
  },
  badgeReady: {
    backgroundColor: colors.successSoft,
    borderColor: "#A8DBC0",
    color: "#1A6638",
  },
  badgeMuted: {
    backgroundColor: colors.lightGray,
    borderColor: colors.line,
    color: colors.muted,
  },
  card: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    overflow: "hidden",
    paddingBottom: 12,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 14,
  },
  cardStripe: {
    bottom: 0,
    left: 0,
    position: "absolute",
    top: 0,
    width: 3,
  },
  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  empty: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
  },
  emptyText: {
    color: colors.text,
    textAlign: "center",
  },
  eventName: {
    color: colors.ink,
    flex: 1,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.2,
    lineHeight: 21,
    paddingLeft: 6,
  },
  dateLabel: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    marginTop: 2,
  },
  header: {
    backgroundColor: colors.blueMid,
    marginHorizontal: -14,
    marginTop: -14,
    paddingBottom: 32,
    paddingHorizontal: 18,
    paddingTop: 28,
  },
  meta: {
    color: colors.grayMid,
    fontSize: 12,
    marginTop: 6,
    paddingLeft: 6,
  },
  screen: {
    paddingBottom: 20,
  },
  sectionTitle: {
    color: colors.blue,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2.5,
    marginBottom: 10,
    marginTop: 18,
    textTransform: "uppercase",
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: -4,
  },
  summaryItem: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    flexBasis: "47%",
    flexGrow: 1,
    padding: 14,
  },
  summaryLabel: {
    color: colors.grayMid,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginTop: 4,
    textTransform: "uppercase",
  },
  summaryValue: {
    color: colors.blue,
    fontSize: 36,
    fontWeight: "900",
    lineHeight: 38,
  },
  title: {
    color: colors.white,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  scoop: {
    backgroundColor: colors.lightGray,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    height: 20,
    marginHorizontal: -14,
    marginTop: -12,
  },
});
