import { useState, useEffect } from "react";
import { useGetTasks } from "../services";
import { httpClient } from "../services/http";

export const TaskListPage = () => {
  const { data: tasks, isLoading, error, refetch } = useGetTasks();
  const [filterCompleted, setFilterCompleted] = useState(false);

  useEffect(() => {
    if (tasks) {
      tasks.forEach((task) => {
        const currentTime = new Date();
        const slaDeadline = new Date(currentTime.getTime() + task.sla * 60 * 60 * 1000);
        if (slaDeadline < currentTime && !task.isCompleted) {
          alert(`O SLA da tarefa "${task.title}" venceu.`);
        }
      });
    }
  }, [tasks]);

  if (isLoading) return <p className="text-center mt-4">Loading tasks...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 mt-4">Failed to load tasks</p>
    );

  const filteredTasks = filterCompleted
    ? tasks?.filter((task) => task.isCompleted)
    : tasks;

  const markTaskAsCompleted = async (taskId: string) => {
    try {
      await httpClient.put(`/tasks/${taskId}/complete`, { isCompleted: true });
      refetch();
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">📋 Task List</h1>

      <div className="text-center mb-4">
        <button
          onClick={() => setFilterCompleted((prev) => !prev)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {filterCompleted ? "Show All Tasks" : "Show Completed Tasks"}
        </button>
      </div>

      <ul className="space-y-4">
        {filteredTasks?.map((task) => (
          <li
            key={task.id}
            className="p-4 bg-white shadow-md rounded-lg flex justify-between items-center border-2 border-gray-300 hover:border-blue-500 focus-within:border-blue-500"
          >
            <div>
              <p className="text-lg text-gray-500 font-semibold">{task.title}</p>
              <p className="text-sm text-gray-500">SLA: {task.sla} hours</p>
            </div>
              {task.isCompleted ? (
                <span className="text-green-500 font-semibold mr-4">Completed</span>
              ) : (
                <button
                  onClick={() => markTaskAsCompleted(task.id)}
                  className=" bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ml-4"
                >
                  Mark as Completed
                </button>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
};
