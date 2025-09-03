import { NextRequest, NextResponse } from "next/server";
import { toggleTask, deleteTask } from "@/lib/tasksStore";

export async function PATCH(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const task = toggleTask(params.id);
    return NextResponse.json(task);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    deleteTask(params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}