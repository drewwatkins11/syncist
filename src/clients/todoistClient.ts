export async function returnTaskInfo(request) {
  const body = await request.json();
  const info = {
    eventName: body.event_name,
    eventId: body.event_data.id,
    projectId: body.event_data.project_id,
    completed: body.event_data.checked === 1,
    labels: body.event_data.labels,
    priority: body.event_data.priority,
    dueDate: body.event_data.due,
    assignee: body.event_data.responsible_uid,
  };
  console.log(info);
  return info;
}
