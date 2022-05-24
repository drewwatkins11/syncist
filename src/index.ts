import { Router } from "itty-router";
import { returnIssueInfo } from "./clients/linearClient";
import { returnTaskInfo } from "./clients/todoistClient";
import { processLinearTask } from "./processLinearTask";

const router = Router();

router
  .post("/ingest/linear", async (request: Request) => {
    const response = await processLinearTask(request);
    // @ts-ignore
    return new Response(response);
  })
  .post("/ingest/todoist", async (request: Request) => {
    // @ts-ignore
    return new Response(await returnTaskInfo(request));
  });

/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).
Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all("*", () => new Response("404, not found!", { status: 404 }));

/*
This snippet ties our worker to the router we deifned above, all incoming requests
are passed to the router where your routes are called and the response is sent.
*/
addEventListener("fetch", (e) => {
  e.respondWith(router.handle(e.request));
});
