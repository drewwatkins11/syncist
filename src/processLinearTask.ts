import { IssueInfo, returnIssueInfo } from "./clients/linearClient";
import { addTask } from "./clients/todoistClient";

const activeStates = ["unstarted", "started"];
const completeStates = ["completed"];

export async function processLinearTask(issue: Request) {
  console.log("processLinearTask");
  const info: IssueInfo = await returnIssueInfo(issue);

  switch (info.action) {
    case "create":
      // Only add a task if issue is in progress or queue up. Ignore backlog and completion states.
      if (activeStates.includes(info.state.type))
        return await addTask(info.title);
      break;
    case "update":
      break;
    default:
      return null;
  }
}
