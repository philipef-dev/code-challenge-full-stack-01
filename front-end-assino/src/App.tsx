import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { TaskFormPage } from "./pages/TaskFormPage";
import { TaskListPage } from "./pages/TaskListPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="p-4">
          <nav className="mb-4">
            <a href="/" className="mr-4 text-blue-500">
              Task List
            </a>
            <a href="/task" className="text-green-500">
              Create Task
            </a>
          </nav>
          <Routes>
            <Route path="/" element={<TaskListPage />} />
            <Route path="/task" element={<TaskFormPage />} />
            <Route path="/task/:taskId" element={<TaskFormPage />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
