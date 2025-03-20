import { useMutation, useQueryClient } from "@tanstack/react-query";

import { httpClient } from "../http";

export type TaskUpdatePayload = {
  title?: string;
  sla?: number;
  file?: File | null;
};

export const updateTask = async (
  taskId: string,
  payload: TaskUpdatePayload
) => {
  try {
    const formData = new FormData();

    if (payload.title) formData.append("title", payload.title);
    if (payload.sla) formData.append("sla", payload.sla.toString());
    if (payload.file) formData.append("file", payload.file);

    const response = await httpClient.put(`/tasks/${taskId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating task", error);
    throw error;
  }
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: TaskUpdatePayload;
    }) => updateTask(taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Failed to update task:", error);
    },
  });
};

/**
 * EXEMPLO DE CÓDIGO DE UM COMPONENTE PARA USAR ESSE SERVIÇO: 
 

import { useState } from "react";
import { useUpdateTask } from "../hooks/useUpdateTask";

export const TaskUpdateForm = ({ taskId }: { taskId: string }) => {
  const [title, setTitle] = useState("");
  const [sla, setSla] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);

  const mutation = useUpdateTask();

  const handleUpdate = () => {
    mutation.mutate({
      taskId,
      payload: { title, sla, file },
    });
  };

  return (
    <div>
      <h3>Update Task</h3>
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
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files?.[0] || null)} 
      />
      <button onClick={handleUpdate} disabled={mutation.isPending}>
        {mutation.isPending ? "Updating..." : "Update Task"}
      </button>
      {mutation.isError && <p>Error updating task</p>}
      {mutation.isSuccess && <p>Task updated successfully!</p>}
    </div>
  );
};

 */