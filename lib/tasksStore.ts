import { Task } from "@/types/task";
import { v4 as uuidv4 } from "uuid";

let tasks: Task[] = [];

export function listTasks(query?: { search?: string; status?: "all" | "active" | "completed" }): Task[] {
  let result = tasks;
  if (query?.search) {
    const search = query.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(search) ||
        (t.description && t.description.toLowerCase().includes(search))
    );
  }
  if (query?.status === "active") {
    result = result.filter((t) => !t.done);
  } else if (query?.status === "completed") {
    result = result.filter((t) => t.done);
  }
  return result;
}

export function createTask(title: string, description?: string): Task {
  if (!title || title.trim().length === 0) {
    throw new Error("Title is required");
  }
  if (title.length > 100) {
    throw new Error("Title must be reasonably short");
  }
  const task: Task = {
    id: uuidv4(),
    title: title.trim(),
    description: description?.trim() || undefined,
    done: false,
    createdAt: new Date().toISOString(),
  };
  tasks.unshift(task);
  return task;
}

export function toggleTask(id: string): Task {
  const task = tasks.find((t) => t.id === id);
  if (!task) throw new Error("Task not found");
  task.done = !task.done;
  return task;
}

export function deleteTask(id: string): void {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Task not found");
  tasks.splice(index, 1);
}