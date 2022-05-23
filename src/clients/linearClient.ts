export async function getMyIssues() {
  const response = await fetch("https://api.linear.app/graphql", {
    body: '{ "query": "{ issues { nodes { id title } } }" }',
    headers: {
      Authorization: LINEAR_API_KEY,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const body = await response.json();
  console.log(body);
  return JSON.stringify(body);
}

export async function returnIssueInfo(request) {
  const body = await request.json();
  const info = {
    id: body.data.id,
    title: body.data.title,
    priorityLabel: body.data.priorityLabel,
    assigneeId: body.data.assigneeId,
    state: {
      name: body.data.state.name,
      type: body.data.state.type,
    },
  };
  console.log(info);
  return info;
}
