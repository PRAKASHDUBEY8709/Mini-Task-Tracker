import { NextRequest, NextResponse } from "next/server";
import { listTasks, createTask } from "@/lib/tasksStore";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  const status = (searchParams.get("status") as "all" | "active" | "completed") || "all";
  const tasks = listTasks({ search, status });
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description } = body;
    const task = createTask(title, description);
    return NextResponse.json(task, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}