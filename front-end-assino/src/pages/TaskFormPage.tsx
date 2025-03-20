import { useCreateTask, useGetTaskById, useUpdateTask } from "../services";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const TaskFormPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const isEditing = Boolean(taskId);

  const { data: task, isLoading } = useGetTaskById(taskId || "");

  const [title, setTitle] = useState("");
  const [sla, setSla] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isEditing && task) {
      setTitle(task.title);
      setSla(task.sla);
    }
  }, [task, isEditing]);

  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();

  const handleSubmit = () => {
    const payload = { title, sla, file };
    console.log(payload);

    if (isEditing) {
      updateMutation.mutate(
        { taskId: taskId!, payload },
        { onSuccess: () => navigate("/") }
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => navigate("/") });
    }
  };

  if (isEditing && isLoading) return <p className="text-center mt-4">Loading task...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? "Edit Task" : "Create Task"}
      </h2>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Task Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title"
          className="w-full p-2 border-2 border-gray-300 text-gray-700 rounded mb-2 focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-required="true"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="sla" className="block text-sm font-medium text-gray-700">
          SLA (in hours)
        </label>
        <input
          type="number"
          id="sla"
          name="sla"
          placeholder="SLA (in hours)"
          className="w-full p-2 border-2 border-gray-300 text-gray-700 rounded mb-2 focus:ring-2 focus:ring-blue-500"
          value={sla}
          onChange={(e) => setSla(Number(e.target.value))}
          aria-required="true"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Attach File (optional)
        </label>
        <input
          type="file"
          id="file"
          name="file"
          className="w-full p-2 border-2 border-gray-300 text-gray-700 rounded mb-2 focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>
      <button
        className={`w-full py-2 rounded ${
          isEditing
            ? "bg-green-500 hover:bg-green-600"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white focus:outline-none focus:ring-2 focus:ring-blue-400`}
        onClick={handleSubmit}
        disabled={createMutation.isPending || updateMutation.isPending}
        aria-live="assertive"
      >
        {isEditing
          ? updateMutation.isPending
            ? "Updating..."
            : "Update Task"
          : createMutation.isPending
          ? "Creating..."
          : "Create Task"}
      </button>
      {(createMutation.isError || updateMutation.isError) && (
        <p className="text-red-500 mt-2" role="alert">
          Error processing task
        </p>
      )}
      {(createMutation.isSuccess || updateMutation.isSuccess) && (
        <p className="text-green-500 mt-2" role="status">
          Task successfully {isEditing ? "updated" : "created"}!
        </p>
      )}
    </div>
  );
};
