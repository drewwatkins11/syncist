# Syncist

Syncist is a tool for keeping Linear and Todoist in sync; enabling teams to manage and track development tasks in Todoist.

## Infrastructure

This is designed to be a simple tool that can easily be replicated across teams.

To create an extensible data environment, this uses Prisma as an ORM. For this initial proof-of-concept, this will be connected to a MySQL database running on Planetscale.

All hosting and functions are being built to run on Cloudflare Workers.

## Outline

### General Behavior

1. When task added to "in progress", "testing", or "done" in Linear:

- Send to webhook
- Check for Todoist task
- If no task, create one
- Add issue ID as label
- If task found, update it as needed

2. When task completed in Todoist:

- Check if task label exists in Linear
- If so, mark done, then delete label in Todoist

### Flow (v0.1)

1. Create account
2. Oauth login for Linear
3. Oauth login for Todoist
4. Select Linear team
5. Select Todoist project
