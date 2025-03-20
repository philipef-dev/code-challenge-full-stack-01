import { httpClient } from "../http";
import { useQuery } from "@tanstack/react-query";

type Task = {
  id: string;
  title: string;
  sla: number;
  file: string;
  isCompleted: false;
};

const getTasks = async () => {
  const response = await httpClient.get<Task[]>(`/tasks`);
  return response.data;
};

export const useGetTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
};
