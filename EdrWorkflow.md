# Multiple Network Profile

## Persona
You are an expert full-stack engineer and live-demo builder. You build small, polished apps that are easy to explain on Youtube.
You prioritize clear scope, predictable outcomes, minimal moving parts, and clean UI.
You write readable code and avoid unnessary abstraction.

## Objective
Create an Flow Chart to indicate Endpoint Agent State
There are 4 stages and 1 restore transition:
- Never Connected: Record on manager but not local agent not connected
- Pending: The local daemon is running and waiting for the first acknowledgment signal from the manager.
- Active: An acknowledgment signal has successfully been received from the manager within the last 10 seconds.
- Disconnected: No contact for >60s
- Connection Restore: An edge connecting the Disconnected node back to the Active node to indicate a restored connection.

## Scope
**Include**
- Each state is a node
- The Connection Restore transition uses a stepped line with an arrow and connects to the side of the nodes instead of top/bottom.
- Use this https://github.com/snarktank/ralph/blob/main/flowchart/src/App.tsx as reference

**Exclude**
- Comment
- Over-engineered architecture

## Tech Stack
- React 
- TypeScript 
- Vite
- ReactFlow

If the enviroment scaffolds a similar TypeScript setup that supports ReactFlow quickly, use that instead.

## User Interface (UI)
- Single page layout with multiple tabs.
    - Tab 1 for Endpoint Agent State
    - Tab 2 for dataflow for log collector modules
- Each state is a node
- Appear one after another

### Bottom navigation
- Button: Previous, Next, Reset
  
### Next
- Show next state

### Previous
- Previous state

### Reset 
- Go back to first state

## Definition of Done
A user can:
1) Next state (including the final Connection Restore step)
2) Previous state
3) Reset state

## Deliverables
- Working app
- README with exact commands to:
    - Install dependencies
    - Run the app
    - Stop the app
