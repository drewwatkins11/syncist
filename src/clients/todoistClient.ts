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

export async function addTask(taskName: string) {
  const task = {
    content: taskName,
    project_id: 2291956402,
  };

  const response = await fetch(`${urlBase}/tasks`, {
    headers,
    method: "POST",
    body: JSON.stringify(task),
  });

  console.log(await response.body);
  const body = await response.json();
  return JSON.stringify(body);
}

export interface TaskInfo {
  eventName: string;
  taskId: number;
  content?: string;
  projectId?: number | null;
  completed: boolean;
  labels?: string[];
  priority?: 1 | 2 | 3 | 4;
  dueDate?: Date | null;
  assignee?: number | null;
}
