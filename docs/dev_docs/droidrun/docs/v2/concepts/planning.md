---
title: 'Planning and Reasoning'
description: 'Understanding DroidRun planning and reasoning capabilities'
---

# 🎯 Planning and Reasoning

DroidRun's planning system allows the DroidAgent to break down complex goals into manageable tasks.

## 📚 Overview

When the `reasoning=True` parameter is enabled, DroidAgent uses a PlannerAgent to:

1. Analyze the user goal
2. Break it down into sequential tasks
3. Track task execution
4. Adapt plans based on results

## 🔄 How Planning Works

<Steps>
  <Step title="Task Analysis">
    The PlannerAgent receives the user's goal and analyzes what needs to be done
  </Step>
  <Step title="Task Generation">
    PlannerAgent creates a task list using the TaskManager
  </Step>
  <Step title="Sequential Execution">
    Tasks are executed one by one using the CodeActAgent
  </Step>
  <Step title="Progress Tracking">
    Successfully completed tasks are marked and failed tasks are noted
  </Step>
  <Step title="Plan Adjustment">
    After tasks are executed, the plan is revisited and updated as needed
  </Step>
</Steps>

## 🛠️ Task Management

The TaskManager component handles:

```python
# Internal task representation
{
    "description": "Open the Settings app",
    "status": "pending"  # pending, attempting, completed, failed
}

# After execution, additional details are added
{
    "description": "Open the Settings app",
    "status": "completed",
    "execution_details": "App launched successfully",
    "step_executed": 1,
    "codeact_steps": 3
}
```

## 📋 Task History

The DroidAgent maintains a complete task history:

```python
# Get execution history in results
result = await agent.run()
task_history = result["task_history"]

# Example task history structure
[
    {"description": "Open Settings app", "status": "completed", ...},
    {"description": "Navigate to Display", "status": "completed", ...},
    {"description": "Enable dark mode", "status": "completed", ...}
]
```

## ⚙️ Using Planning

Enable planning during agent creation:

```python
agent = DroidAgent(
    goal="Configure device settings",
    llm=llm,
    tools_instance=tools,
    reasoning=True,  # Enable planning
    max_steps=15,    # Maximum planning iterations
    timeout=1000     # Overall timeout in seconds
)
```

## 🔄 Memory and Context

The planning system maintains context between iterations:

1. **Task History**: Keeps track of completed and failed tasks
2. **Memory Storage**: Remembers important information via tools.remember()
3. **Execution Details**: Stores tool execution results

```python
# Store important information for future planning
await tools.remember("Device is running Android 11")
await tools.remember("Wi-Fi password is 'example123'")
```

## 🧠 When to Use Planning

Planning is most effective for:

<CardGroup cols={2}>
  <Card title="Complex Goals" icon="diagram-project">
    Multi-step operations requiring coordination
  </Card>
  <Card title="Error-Prone Tasks" icon="triangle-exclamation">
    Operations that may require retries or error handling
  </Card>
  <Card title="Dynamic Workflows" icon="arrows-spin">
    Tasks where next steps depend on previous results
  </Card>
  <Card title="UI Workflows" icon="window">
    Navigation through multiple app screens
  </Card>
</CardGroup>

## 💡 Best Practices

1. **Clear Goal Description**
   - Be specific about what you want to achieve
   - Include success criteria when possible

2. **Appropriate Step Limits**
   - Increase max_steps for complex workflows
   - Consider device and network performance

3. **Error Handling**
   - Check task_history for debugging failed tasks

4. **Memory Usage**
   - Use tools.remember() for key information
   - Include discovered data in task descriptions 