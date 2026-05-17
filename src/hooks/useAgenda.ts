import { useCallback, useEffect, useState } from "react";
import ApiServiceFetch from "@api/ApiServiceFetch";
import endPoints from "@constants/endPoints";
import { AgendaEvent, AgendaSummary, AvailabilityResponse, ScheduleRequest } from "@models/agenda";
import { endpoint } from "@utils/routes";

export function useAgenda() {
  const [summary, setSummary] = useState<AgendaSummary | null>(null);
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [requests, setRequests] = useState<ScheduleRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryResponse, requestsResponse] = await Promise.all([
        ApiServiceFetch.get<AgendaSummary>({ url: endPoints.app.agenda.summary }),
        ApiServiceFetch.get<ScheduleRequest[]>({ url: endPoints.app.scheduleRequests.list }),
      ]);

      setSummary(summaryResponse);
      setEvents(summaryResponse.events);
      setRequests(requestsResponse);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAvailability = useCallback((eventId: number) => {
    return ApiServiceFetch.get<AvailabilityResponse>({
      url: endpoint(endPoints.app.agenda.availability, { id: eventId }),
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    summary,
    events,
    requests,
    loading,
    load,
    getAvailability,
  };
}
