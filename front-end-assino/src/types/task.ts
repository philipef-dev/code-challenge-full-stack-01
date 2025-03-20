export interface Task {
    id?: string;
    title: string;
    sla: number;
    isCompleted: false;
    file?: File | null;
}