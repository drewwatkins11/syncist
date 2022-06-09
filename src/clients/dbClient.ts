import { Task } from "../types/database";

export const getTaskFromDb = async (
  service: "todoist" | "linear",
  taskId: Task["todoist_task_id"] | Task["linear_task_id"],
  db: any
) => {
  if (!["todoist", "linear"].includes(service))
    throw new Error("Invalid service");

  const column = `${service}_task_id`;

  const { data }: { data: Task } = await db
    .from("task")
    .select()
    .eq(column, taskId)
    .maybeSingle();

  if (data) {
    return data;
  } else return null;
};
