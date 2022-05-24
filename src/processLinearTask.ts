import { IssueInfo, returnIssueInfo } from "./clients/linearClient";
import { addTask, completeTask } from "./clients/todoistClient";
import { Task } from "./types/database";

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
          .insert({ todoist_task_id: task.id, linear_task_id: info.id });

        if (error) {
          console.error("error adding task to database", error);
          return error;
        }

        return data[0];
      }
      break;
    case "update":
      // If task completed in Linear
      if (completeStates.includes(info.state.type)) {
        // Check if task is in Todoist
        const { data: task }: { data: Task } = await db
          .from("task")
          .select()
          .eq("linear_task_id", info.id)
          .maybeSingle();

        // If not completed, mark completed in Todoist
        if (task && !task.completed) {
          const completed = await completeTask(task.todoist_task_id)
            .then(async () => {
              const { data, error } = await db
                .from("task")
                .update({ completed: true, active: false })
                .match({ linear_task_id: info.id });

              if (error) throw new Error(error);
              return {
                task: data["0"],
                success: true,
                message: "Task completion status synced",
              };
            })
            .catch((err) => {
              console.log("error updating task in db", err);
            });

          console.log(completed);
          return completed;
        }
      }
      break;
    default:
      return null;
  }
}
