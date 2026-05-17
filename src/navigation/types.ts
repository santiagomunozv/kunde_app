import { AgendaEvent } from "@models/agenda";

export type AuthStackParamList = {
  Login: undefined;
};

export type AppTabParamList = {
  Agenda: undefined;
  Solicitudes: undefined;
  Perfil: undefined;
};

export type RootStackParamList = {
  AppTabs: undefined;
  Schedule: { event: AgendaEvent };
  EventDetail: { event: AgendaEvent };
};
