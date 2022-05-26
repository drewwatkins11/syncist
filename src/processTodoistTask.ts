import { markIssueComplete } from "./clients/linearClient";
import {
  completeTask,
  returnTaskInfo,
  TaskInfo,
} from "./clients/todoistClient";
import { Task, Team } from "./types/database";

export async function processTodoistTask(issue: Request, db: any) {
  console.log("processing Todoist task");
  const info: TaskInfo = await returnTaskInfo(issue);

  let team: Team | undefined;

  if (info?.projectId) {
    const teamData = async () => {
      const { data }: { data: Team } = await db
        .from("team")
        .select()
        .eq("todoist_project_id", info.projectId)
        .maybeSingle();

      return data;
    };
    team = await teamData();
  } else return "Team Not Found.";

  switch (info.eventName) {
    case "item:completed":
      console.log("completing task");
      // If task completed in Todoist, check if task is tracked
      const { data: task }: { data: Task } = await db
        .from("task")
        .select()
        .eq("todoist_task_id", info.taskId)
        .maybeSingle();

      console.log(task);

      // If not completed, mark done in Linear
      if (team?.linear_final_state_id && task && !task.completed) {
        const completed = await markIssueComplete(
          task.linear_task_id,
          team.linear_final_state_id
        );

        if (completed) {
          const { data, error } = await db
            .from("task")
            .update({ completed: true, active: false })
            .match({ id: task.id });

          if (error) {
            console.log(error);
            throw new Error(error);
          }

          return {
            task: data["0"],
            success: true,
            message: "Task completion status synced",
          };
        }
      }
      break;
    default:
      return null;
  }
}
