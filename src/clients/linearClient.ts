import gql from "graphql-tag";
import { Team } from "../types/database";

const url = "https://api.linear.app/graphql";
const headers = {
  // @ts-ignore
  Authorization: LINEAR_API_KEY,
  "Content-Type": "application/json",
};
const method = "POST";

const client = async (body: string) => {
  // @ts-ignore
  const response = await fetch(url, {
    body,
    headers,
    method,
  });

  return response.json();
};

export async function getMyIssues() {
  const body = '{ "query": "{ issues { nodes { id title } } }" }';

  const response = client(body);
  return response;
}

export async function markIssueComplete(
  issueId: IssueInfo["id"],
  finalStateId: Team["linear_final_state_id"]
) {
  const body = JSON.stringify({
    query: `
      mutation IssueUpdate($id: String!, $stateId: String!) {
        issueUpdate(id: $id, input: { stateId: $stateId }) {
          success
        }
      }
    `,
    variables: {
      id: issueId,
      stateId: finalStateId,
    },
  });

  const response: any = await client(body);
  const success = response?.data?.issueUpdate?.success;
  return success;
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
