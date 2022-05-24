# Syncist

Syncist is a tool for keeping Linear and Todoist in sync; enabling teams to manage and track development tasks in Todoist.

## Infrastructure

This is designed to be a simple tool that can easily be replicated across teams. Syncist is using Supabase for the database to enable teams to easily spin up a new environment.

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

# Setup

1. Set up Supabase environment
2. Deploy worker script to Cloudflare using Wrangler CLI
3. Create Todoist application
4. Obtain Todoist token and add to secrets
5. Obtain Linear token and add to secrets
6. Set up Todoist webhook
7. Set up Linear webhook
