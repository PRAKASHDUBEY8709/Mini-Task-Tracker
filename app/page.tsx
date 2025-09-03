'use client';
import { useEffect, useState } from "react";
import { Task } from "@/types/task";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const status = searchParams.get("status") || "all";
  const search = searchParams.get("search") || "";

  function updateQuery(params: Record<string, string>) {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (v) sp.set(k, v);
      else sp.delete(k);
    });
    router.push(`/?${sp.toString()}`);
  }

  async function fetchTasks() {
    const res = await fetch(`/api/tasks?status=${status}&search=${encodeURIComponent(search)}`);
    const data = await res.json();
    setTasks(data);
  }

  useEffect(() => {
    fetchTasks();
  }, [status, search]);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTitle("");
      setDescription("");
      setMessage("Task added!");
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function toggleTask(id: string) {
    await fetch(`/api/tasks/${id}`, { method: "PATCH" });
    fetchTasks();
  }

  async function deleteTask(id: string) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setMessage("Task deleted!");
    fetchTasks();
  }

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mini Task Tracker</h1>

      <form onSubmit={addTask} className="mb-4 space-y-2">
        <div>
          <label className="block font-medium">Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Task
        </button>
      </form>

      <div className="flex items-center gap-2 mb-4">
        <select
          value={status}
          onChange={(e) => updateQuery({ status: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => updateQuery({ search: e.target.value })}
          className="border p-2 rounded flex-1"
        />
      </div>

      {message && <p className="text-green-600 mb-2">{message}</p>}

      <ul className="space-y-2">
        {tasks.length === 0 && <li className="text-gray-500">No tasks found.</li>}
        {tasks.map((task) => (
          <li key={task.id} className="border rounded p-2 flex justify-between items-center">
            <div>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                className="mr-2"
              />
              <span className={task.done ? "line-through" : ""}>{task.title}</span>
              {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
              <p className="text-xs text-gray-400">Created: {new Date(task.createdAt).toLocaleString()}</p>
            </div>
            <button onClick={() => deleteTask(task.id)} className="text-red-600 ml-4">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}