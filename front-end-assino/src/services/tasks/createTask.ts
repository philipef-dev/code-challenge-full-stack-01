import { useMutation, useQueryClient } from "@tanstack/react-query";

import { httpClient } from "../http";

export type TaskCreatePayload = {
  title: string;
  sla: number;
  file?: File | null;
};

export const createTask = async (payload: TaskCreatePayload) => {
  try {
    const formData = new FormData();

    formData.append("title", payload.title);
    formData.append("sla", payload.sla.toString());
    if (payload.file) formData.append("file", payload.file);

    const response = await httpClient.post("/tasks", formData);

    return response.data;
  } catch (error) {
    console.error("Error creating task", error);
    throw error;
  }
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TaskCreatePayload) => createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Failed to create task:", error);
    },
  });
};


/**
 * EXEMPLO DE CÓDIGO DE UM COMPONENTE PARA USAR ESSE SERVIÇO:
 * 
 
import { useState } from "react";
import { useCreateTask } from "../hooks/useCreateTask";

export const TaskCreateForm = () => {
  const [title, setTitle] = useState("");
  const [sla, setSla] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);

  const mutation = useCreateTask();

  const handleCreate = () => {
    mutation.mutate({ title, sla, file });
  };

  return (
    <div>
      <h3>Create Task</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="SLA (in hours)"
        value={sla}
        onChange={(e) => setSla(Number(e.target.value))}
      />
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleCreate} disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create Task"}
      </button>
      {mutation.isError && <p>Error creating task</p>}
      {mutation.isSuccess && <p>Task created successfully!</p>}
    </div>
  );
};

 */