---
title: 'Execution Tracing'
description: 'Monitor and debug DroidRun executions with Arize Phoenix'
---

# 🔍 Execution Tracing

DroidRun provides powerful execution tracing capabilities using Arize Phoenix, allowing you to visualize, debug, and analyze agent behavior in detail.

## 📋 Prerequisites

Before using tracing features, you need to install Arize Phoenix:

```bash
pip install "arize-phoenix[llama-index]"
```

## 🚀 Starting the Phoenix Server

**Important:** Before running any DroidRun commands with tracing enabled, you must start the Phoenix server in a separate terminal:

```bash
phoenix serve
```

This will launch the Phoenix visualization server, typically at [http://localhost:6006](http://localhost:6006).

<Note>
Keep this terminal window open while using DroidRun with tracing. If the Phoenix server is not running when tracing is enabled, DroidRun will throw an error.
</Note>

## ⚙️ Enabling Tracing

### In CLI

Enable tracing with the `--tracing` flag:

```bash
droidrun "Open settings and enable dark mode" --tracing
```

### In Python

Set `enable_tracing=True` when creating the DroidAgent:

```python
from droidrun.agent.droid import DroidAgent
from droidrun.agent.utils.llm_picker import load_llm
from droidrun.tools import load_tools

async def main():
    tool_list, tools_instance = await load_tools()
    llm = load_llm(provider_name="Gemini", model="models/gemini-2.5-pro")
    
    # Enable tracing
    agent = DroidAgent(
        goal="Your task",
        llm=llm,
        tools_instance=tools_instance,
        tool_list=tool_list,
        enable_tracing=True  # This activates Phoenix tracing
    )
    
    await agent.run()
```

## 🔄 Understanding the Trace UI

After running a DroidRun command with tracing enabled, visit the Phoenix UI at [http://localhost:6006](http://localhost:6006) to view the trace data:

<CardGroup cols={2}>
  <Card title="Execution Flow" icon="diagram-project">
    Visualize the entire agent execution process from start to finish
  </Card>
  <Card title="LLM Interactions" icon="brain">
    See every prompt and response between your agent and the LLM
  </Card>
  <Card title="Tool Calls" icon="screwdriver-wrench">
    Examine all tool executions and their inputs/outputs
  </Card>
  <Card title="Planning Steps" icon="list-check">
    Understand how the planning system broke down complex tasks
  </Card>
</CardGroup>

## 📊 Trace Analysis Features

Phoenix provides several key features for analyzing DroidRun execution:

### Token Usage Analysis

Monitor token consumption across different parts of your agent's execution:

- Prompt tokens used by planning system
- Completion tokens in tool executions
- Total token usage per run

### Time Analysis

Understand where time is spent during execution:

- LLM API call durations
- Tool execution times
- Planning overhead

### Error Detection

Pinpoint exactly where and why errors occur:

- Failed tool executions
- Errors in planning logic
- LLM response issues

## 💡 Tips for Effective Tracing

1. **Run the Phoenix server first**
   - Always start `phoenix serve` before running DroidRun with tracing
   - Keep the server terminal open during your entire session

2. **Use meaningful task names**
   - Descriptive goal statements make traces easier to identify in the UI

3. **Track execution efficiency**
   - Compare different approaches by examining token and time usage

4. **Debug complex workflows**
   - Use tracing to understand failures in multi-step operations
   - Identify steps where the agent gets confused

5. **Share traces with others**
   - Phoenix allows saving and sharing traces for collaborative debugging

## 🔧 Troubleshooting

### "Failed to connect to Phoenix" Error

If you see this error, ensure:
- Phoenix server is running (`phoenix serve` in a separate terminal)
- You're using the correct port (default is 6006)
- No firewall is blocking the connection

### High Memory Usage

If Phoenix is consuming too much memory:
- Clear old traces periodically via the UI
- Restart the Phoenix server if needed

### Missing Tool Executions

If tool calls are missing from traces:
- Ensure you're using the latest DroidRun version
- Check that all tools are properly registered

## 🎯 Example Workflow

A typical workflow with tracing looks like this:

1. Start Phoenix server: `phoenix serve`
2. Run DroidRun with tracing: `droidrun "Your task" --tracing`
3. Open browser to [http://localhost:6006](http://localhost:6006)
4. Analyze the execution trace
5. Make adjustments to your approach based on insights
6. Run again to compare results 