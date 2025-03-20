import { Task } from "../../types";
import { httpClient } from "../http";
import { useQuery } from "@tanstack/react-query";

const fetchTaskById = async (taskId: string): Promise<Task> => {
  const response = await httpClient.get(`/tasks/${taskId}`);
  return response.data;
};

export const useGetTaskById = (taskId: string) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchTaskById(taskId),
    enabled: !!taskId, // Apenas executa se houver um ID válido
  });
};
