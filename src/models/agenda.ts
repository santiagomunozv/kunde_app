export type AgendaSummary = {
  hours: {
    contracted: number;
    confirmed: number;
    requested: number;
    available: number;
  };
  stats: {
    totalEvents: number;
    pending: number;
    requested: number;
    assigned: number;
    completed: number;
  };
  events: AgendaEvent[];
};

export type AgendaEvent = {
  id: number;
  eventId: number;
  name: string;
  modality: string;
  estimatedDate: string | null;
  estimatedTime: string | null;
  duration: number;
  status: string;
  statusLabel?: string;
  canSchedule: boolean;
};

export type AgendaEventDetail = AgendaEvent & {
  activeRequest: {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    modality: string;
    type: string;
    status: string;
    observation?: string | null;
    createdAt?: string | null;
  } | null;
  meeting: {
    id: number;
    subject: string;
    date: string;
    startTime: string;
    endTime: string;
    modality: string;
    location?: string | null;
    description?: string | null;
    status: string;
    manager: {
      id?: number | null;
      name?: string | null;
      email?: string | null;
      phone?: string | null;
    };
  } | null;
};

export type AvailabilitySlot = {
  date?: string;
  startTime: string;
  endTime: string;
  duration?: number;
  available?: boolean;
  remainingCapacity?: number;
  reason?: string | null;
};

export type AvailabilityDay = {
  date: string;
  slots: AvailabilitySlot[];
};

export type AvailabilityResponse = {
  eventId: number;
  duration: number;
  modality: string;
  workingHours: {
    start: string | null;
    end: string | null;
  };
  hours: AgendaSummary["hours"];
  days: AvailabilityDay[];
};

export type ScheduleRequest = {
  id?: number;
  terceroEventoPeriodicidadId?: number;
  eventId?: number;
  eventName?: string;
  eventCode?: string | null;
  eventMessage?: string | null;
  eventColor?: string | null;
  date?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  modality?: string;
  type?: string;
  status?: string;
  observation?: string | null;
  createdAt?: string | null;
  oidSolicitudAgendamiento?: number;
  TerceroEventoPeriodicidad_oidTerceroEventoPeriodicidad?: number;
  Evento_oidEvento?: number;
  txNombreEvento?: string;
  dtFechaSolicitudAgendamiento?: string;
  hrHoraInicioSolicitudAgendamiento?: string;
  hrHoraFinSolicitudAgendamiento?: string;
  inDuracionSolicitudAgendamiento?: number;
  lsModalidadSolicitudAgendamiento?: string;
  txEstadoSolicitudAgendamiento?: string;
};
