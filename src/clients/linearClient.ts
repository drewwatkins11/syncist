export async function getMyIssues() {
  const response = await fetch("https://api.linear.app/graphql", {
    body: '{ "query": "{ issues { nodes { id title } } }" }',
    headers: {
      // @ts-ignore
      Authorization: LINEAR_API_KEY,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const body = await response.json();
  console.log(body);
  return JSON.stringify(body);
}

export async function returnIssueInfo(request: Request) {
  const body: any = await request.json();
  const info: IssueInfo = {
    action: body.action,
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

export interface IssueInfo {
  action: string;
  id: string;
  title: string;
  priorityLabel?: string;
  assigneeId?: string;
  state: IssueInfoState;
}

interface IssueInfoState {
  name: string;
  type: string;
}
