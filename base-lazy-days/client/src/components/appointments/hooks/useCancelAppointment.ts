import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Appointment } from "@shared/types";

import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";

// for when server call is needed
async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  const patchData = [{ op: "remove", path: "/userId" }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  const toast = useCustomToast();

  // TODO: replace with mutate function

  const { mutate } = useMutation({
    mutationFn: (appointment: Appointment) =>
      removeAppointmentUser(appointment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.appointments],
      });
      toast({ title: "cacle success!", status: "success" });
    },
  });

  return mutate;
}
