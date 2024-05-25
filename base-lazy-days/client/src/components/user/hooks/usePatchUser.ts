import { useMutation, useQueryClient } from "@tanstack/react-query";
import jsonpatch from "fast-json-patch";

import type { User } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";
import { useUser } from "./useUser";

import { toast } from "@/components/app/toast";
import { queryKeys } from "@/react-query/constants";

export const MUTATION_KEY = "patch-user";

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData.token),
    }
  );
  return data.user;
}

export function usePatchUser() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  // TODO: replace with mutate function

  const { mutate: patchUser } = useMutation({
    mutationKey: [MUTATION_KEY],
    mutationFn: (newData: User) => patchUserOnServer(newData, user),
    onSuccess: () => {
      toast({ title: "User Patch Success!", status: "success" });
    },
    onSettled: () => {
      // onSuccess와 다르게 성공하든 오류가 뜨든 무조건 실행
      // invalidate 이후 서버에서 데이터를 받기까지 변형이 진행중인 상태 유지를 위해 이 프로미스를 반환해야함
      return queryClient.invalidateQueries({
        queryKey: [queryKeys.user],
      });
    },
  });

  return patchUser;
}
