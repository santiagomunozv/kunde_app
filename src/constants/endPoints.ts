const endPoints = {
  app: {
    auth: {
      login: "/auth/login",
      logout: "/auth/logout",
      me: "/me",
      clientPhoto: "/client/photo",
    },
    agenda: {
      summary: "/agenda",
      events: "/agenda/events",
      eventDetail: "/agenda/events/:id",
      availability: "/agenda/events/:id/availability",
      scheduleRequests: "/agenda/schedule-requests",
    },
    scheduleRequests: {
      list: "/schedule-requests",
      cancel: "/schedule-requests/:id/cancel",
      postpone: "/schedule-requests/:id/postpone",
    },
    meetings: {
      list: "/meetings",
      detail: "/meetings/:id",
    },
  },
};

export default endPoints;
