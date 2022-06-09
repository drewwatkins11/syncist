import config from "../../config";
import { Task } from "../types/database";
import { DateYMDString } from "../types/dates";

const urlBase = "https://api.todoist.com/rest/v1";
const headers = {
  // @ts-ignore
  Authorization: `Bearer ${TODOIST_API_KEY}`,
  "Content-Type": "application/json",
};

export async function returnTaskInfo(request: Request) {
  const body: any = await request.json();
  const info: TaskInfo = {
    eventName: body.event_name,
    taskId: body.event_data.id,
    content: body.event_data.content,
    projectId: body.event_data.project_id,
    completed: body.event_data.checked === 1,
    labels: body.event_data.labels,
    priority: body.event_data.priority,
    dueDate: body.event_data.due,
    assignee: body.event_data.responsible_uid,
  };
  return info;
}

export async function addTask(taskName: string, dueDate?: Due["date"]) {
  const task = {
    content: taskName,
    project_id: config.todoistProject,
    due_date: dueDate || null,
  };

  const response = await fetch(`${urlBase}/tasks`, {
    headers,
    method: "POST",
    body: JSON.stringify(task),
  });

  const body = await response.json();
  return body;
}

export async function completeTask(taskId: Task["todoist_task_id"]) {
  const response = await fetch(`${urlBase}/tasks/${taskId}/close`, {
    headers,
    method: "POST",
  });

  const body = await response.body;
  return body;
}

export async function updateTask(
  taskId: Task["todoist_task_id"],
  taskInfo: { content?: TaskInfo["content"]; due_date?: Due["date"] }
) {
  const response = await fetch(`${urlBase}/tasks/${taskId}`, {
    headers,
    method: "POST",
    body: JSON.stringify(taskInfo),
  });

  const body = await response.body;
  return body;
}

export interface TaskInfo {
  eventName:
    | "item:added"
    | "item:completed"
    | "item:uncompleted"
    | "item:updated"
    | "item:deleted";
  taskId: number;
  content?: string;
  projectId?: number | null;
  completed: boolean;
  labels?: string[];
  priority?: 1 | 2 | 3 | 4;
  dueDate?: Due | null;
  assignee?: number | null;
}

interface Due {
  date: DateYMDString | null;
  datetime?: string;
  recurring: boolean;
  string: string;
  timezone?: string;
}
