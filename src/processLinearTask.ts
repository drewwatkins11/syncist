import { IssueInfo, returnIssueInfo } from "./clients/linearClient";
import { addTask } from "./clients/todoistClient";

const activeStates = ["unstarted", "started"];
const completeStates = ["completed"];

export async function processLinearTask(issue: Request, db: any) {
  console.log("processLinearTask");
  const info: IssueInfo = await returnIssueInfo(issue);

  switch (info.action) {
    case "create":
      // Only add a task if issue is in progress or queue up. Ignore backlog and completion states.
      if (activeStates.includes(info.state.type)) {
        const task: any = await addTask(info.title);
        const { data, error } = await db
          .from("task")
          .insert([{ todoist_task_id: task.id, linear_task_id: info.id }]);

        if (error) {
          console.error("error adding task to database", error);
          return error;
        }

        return data[0];
      }
      break;
    case "update":
      break;
    default:
      return null;
  }
}
