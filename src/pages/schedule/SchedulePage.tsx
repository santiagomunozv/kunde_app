import { useEffect, useMemo, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import ApiServiceFetch from "@api/ApiServiceFetch";
import { Button } from "@components/ui/Button";
import { Screen } from "@components/ui/Screen";
import endPoints from "@constants/endPoints";
import messages from "@constants/messages";
import { useToast } from "@hooks/useToast";
import { ApiError } from "@models/api";
import { AvailabilitySlot } from "@models/agenda";
import { RootStackParamList } from "@navigation/types";
import colors from "@theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Schedule">;
type AvailabilityDayGroup = {
  date: string;
  slots: AvailabilitySlot[];
};

const MONTH_LABELS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const WEEKDAY_LABELS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MAX_MONTH_OFFSET = 3;

function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthKeyToDate(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function addMonths(monthKey: string, amount: number) {
  const date = monthKeyToDate(monthKey);
  date.setMonth(date.getMonth() + amount);
  return getMonthKey(date);
}

function getMonthOffset(monthKey: string) {
  const current = monthKeyToDate(getMonthKey());
  const target = monthKeyToDate(monthKey);
  return (target.getFullYear() - current.getFullYear()) * 12 + target.getMonth() - current.getMonth();
}

function formatMonthLabel(monthKey: string) {
  const date = monthKeyToDate(monthKey);
  return `${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDayLabel(dateText: string) {
  const [year, month, day] = dateText.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return `${WEEKDAY_LABELS[date.getDay()]} ${day}`;
}

export function SchedulePage({ navigation, route }: Props) {
  const { event } = route.params;
  const toast = useToast();
  const [days, setDays] = useState<AvailabilityDayGroup[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [observation, setObservation] = useState("");
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(getMonthKey());
  const [saving, setSaving] = useState(false);

  const modality = useMemo(() => event.modality || "Virtual", [event.modality]);
  const monthOffset = getMonthOffset(selectedMonth);
  const canGoPreviousMonth = monthOffset > 0;
  const canGoNextMonth = monthOffset < MAX_MONTH_OFFSET;

  useEffect(() => {
    let active = true;

    async function loadAvailability() {
      setLoadingAvailability(true);
      setAvailabilityError(null);
      try {
        const response = await ApiServiceFetch.get<{
          days: { date: string; slots: AvailabilitySlot[] }[];
        }>({
          url: `${endPoints.app.agenda.availability.replace(":id", String(event.id))}?month=${selectedMonth}`,
          timeoutMs: 60000,
        });

        if (!active) {
          return;
        }

        const nextDays = response.days
          .map((day) => {
            return {
              date: day.date,
              slots: day.slots
                .filter((slot) => slot.available !== false)
                .map((slot) => ({ ...slot, date: slot.date || day.date })),
            };
          })
          .filter((day) => day.slots.length > 0);
        const nextSlots = nextDays.flatMap((day) => day.slots);

        setDays(nextDays);
        setSelectedSlot(nextSlots[0] || null);
      } catch (err) {
        if (!active) {
          return;
        }

        const message = err instanceof ApiError ? err.message : messages.agenda.availabilityError;
        setAvailabilityError(message);
        toast.error(messages.toast.errorTitle, message);
      } finally {
        if (active) {
          setLoadingAvailability(false);
        }
      }
    }

    loadAvailability();

    return () => {
      active = false;
    };
  }, [event.id, selectedMonth]);

  const changeMonth = (amount: number) => {
    setSelectedMonth((current) => addMonths(current, amount));
  };

  const createRequest = async () => {
    if (!selectedSlot) {
      toast.error(messages.toast.errorTitle, "Selecciona un horario disponible.");
      return;
    }

    setSaving(true);
    try {
      await ApiServiceFetch.post({
        url: endPoints.app.agenda.scheduleRequests,
        data: {
          terceroEventoPeriodicidadId: event.id,
          date: selectedSlot.date || "",
          startTime: selectedSlot.startTime,
          modality,
          observation,
        },
      });
      toast.success(messages.toast.successTitle, messages.agenda.requestCreated);
      navigation.goBack();
    } catch {
      toast.error(messages.toast.errorTitle, messages.agenda.requestError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen contentContainerStyle={styles.screen}>
      <View style={styles.hero}>
        <Pressable onPress={navigation.goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" color={colors.white} size={22} />
        </Pressable>
        <Text style={styles.pill}>{modality} · {event.duration} min</Text>
        <Text style={styles.title}>{event.name}</Text>
      </View>
      <View style={styles.scoop} />

      <View style={styles.monthSwitcher}>
        <Pressable
          disabled={!canGoPreviousMonth || loadingAvailability}
          onPress={() => changeMonth(-1)}
          style={[styles.monthButton, !canGoPreviousMonth || loadingAvailability ? styles.monthButtonDisabled : null]}
        >
          <Text style={[styles.monthButtonText, !canGoPreviousMonth || loadingAvailability ? styles.monthButtonTextDisabled : null]}>{"<"}</Text>
        </Pressable>
        <Text style={styles.monthLabel}>{formatMonthLabel(selectedMonth)}</Text>
        <Pressable
          disabled={!canGoNextMonth || loadingAvailability}
          onPress={() => changeMonth(1)}
          style={[styles.monthButton, !canGoNextMonth || loadingAvailability ? styles.monthButtonDisabled : null]}
        >
          <Text style={[styles.monthButtonText, !canGoNextMonth || loadingAvailability ? styles.monthButtonTextDisabled : null]}>{">"}</Text>
        </Pressable>
      </View>

      {loadingAvailability ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={colors.blue} />
          <Text style={styles.loadingText}>Consultando disponibilidad...</Text>
        </View>
      ) : availabilityError ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{availabilityError}</Text>
        </View>
      ) : days.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No encontramos horarios disponibles en este mes.</Text>
        </View>
      ) : (
        days.map((day) => (
          <View key={day.date} style={styles.dayGroup}>
            <Text style={styles.dayTitle}>{formatDayLabel(day.date)}</Text>
            <View style={styles.slotGrid}>
              {day.slots.map((slot) => {
                const active = selectedSlot?.date === slot.date && selectedSlot?.startTime === slot.startTime;
                return (
                  <Pressable key={`${slot.date}-${slot.startTime}`} onPress={() => setSelectedSlot(slot)} style={[styles.slot, active ? styles.slotActive : null]}>
                    <Text style={[styles.slotTime, active ? styles.slotTimeActive : null]}>{slot.startTime}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>Observación</Text>
      <TextInput
        multiline
        onChangeText={setObservation}
        placeholder="Agrega una observación opcional"
        placeholderTextColor={colors.muted}
        style={styles.textArea}
        value={observation}
      />

      <Button title="Reservar espacio" onPress={createRequest} loading={saving} disabled={!selectedSlot || loadingAvailability} />
    </Screen>
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
    marginBottom: 12,
    width: 36,
  },
  empty: {
    backgroundColor: colors.white,
    borderRadius: 14,
    marginHorizontal: 14,
    padding: 16,
  },
  emptyText: {
    color: colors.text,
  },
  dayGroup: {
    marginBottom: 14,
    marginHorizontal: 14,
  },
  dayTitle: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  hero: {
    backgroundColor: colors.blueMid,
    marginHorizontal: -14,
    marginTop: -14,
    paddingBottom: 22,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  loadingBox: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 14,
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 14,
    padding: 16,
  },
  loadingText: {
    color: colors.text,
    fontWeight: "700",
  },
  monthButton: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1.5,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  monthButtonDisabled: {
    backgroundColor: colors.lightGray,
  },
  monthButtonText: {
    color: colors.blue,
    fontSize: 14,
    fontWeight: "900",
  },
  monthButtonTextDisabled: {
    color: colors.muted,
  },
  monthLabel: {
    color: colors.ink,
    flex: 1,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  monthSwitcher: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
    marginHorizontal: 14,
  },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    borderWidth: 1,
    color: "rgba(255,255,255,0.78)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    textTransform: "uppercase",
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
    paddingBottom: 20,
  },
  sectionTitle: {
    color: colors.grayMid,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 12,
    marginTop: 24,
    paddingHorizontal: 14,
    textTransform: "uppercase",
  },
  slot: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 10,
    borderWidth: 1.5,
    height: 42,
    justifyContent: "center",
    minWidth: "30%",
    paddingHorizontal: 10,
  },
  slotActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  slotTime: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
  slotTimeActive: {
    color: colors.white,
  },
  textArea: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1.5,
    color: colors.ink,
    marginHorizontal: 14,
    marginBottom: 18,
    minHeight: 96,
    padding: 14,
    textAlignVertical: "top",
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.3,
    lineHeight: 24,
  },
});
