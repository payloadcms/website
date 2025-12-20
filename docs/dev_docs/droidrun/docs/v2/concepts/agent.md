---
title: 'DroidAgent'
description: 'Understanding the DroidAgent system in DroidRun'
---

# 🤖 DroidAgent

DroidRun uses a powerful DroidAgent system that combines LLM-based reasoning and execution to control Android devices effectively.

## 📚 Core Components

The DroidAgent architecture consists of:

- **Planning System**: Optional planning capabilities provided by PlannerAgent
- **Execution System**: CodeActAgent for executing tasks
- **Tool System**: Modular tools for Android device control
- **Vision Integration**: Optional screen analysis capabilities

## 🔄 Execution Flow

<Steps>
  <Step title="Goal Setting">
    The user provides a natural language task like "Open settings and enable dark mode"
  </Step>
  <Step title="Planning (With Reasoning)">
    If reasoning=True, PlannerAgent breaks down the goal into smaller tasks
  </Step>
  <Step title="Task Execution">
    CodeActAgent executes each task using the appropriate tools
  </Step>
  <Step title="Result Analysis">
    The agent analyzes results and determines next steps
  </Step>
  <Step title="Error Handling">
    Failed tasks can be retried or the plan adjusted
  </Step>
</Steps>

## 🛠️ Available Tools

The DroidAgent has access to these core tools:

<AccordionGroup>
  <Accordion title="UI Interaction">
    - `get_clickables()` - Get interactive UI elements
    - `tap_by_index(index)` - Tap element by index
    - `tap(index)` - Simplified tap by index
    - `swipe(start_x, start_y, end_x, end_y)` - Swipe between coordinates
    - `input_text(text)` - Type text
    - `press_key(keycode)` - Press system keys (e.g., 4 for BACK)
  </Accordion>

  <Accordion title="App Management">
    - `start_app(package)` - Launch apps
    - `list_packages()` - List installed packages
    - `install_app(apk_path)` - Install APKs
  </Accordion>

  <Accordion title="Screen Analysis">
    - `take_screenshot()` - Capture screen
    - `extract(filename)` - Save UI state to JSON
    - `get_all_elements()` - Get complete UI hierarchy
    - `get_phone_state()` - Get current activity and keyboard status
  </Accordion>

  <Accordion title="Task Management">
    - `remember(information)` - Store important information
    - `get_memory()` - Retrieve stored information
    - `complete(success, reason)` - Signal task completion
  </Accordion>
</AccordionGroup>

## 📸 Vision System

The vision system enhances the agent's capabilities:

```python
agent = DroidAgent(
    goal="Open settings and enable dark mode",
    llm=llm,
    tools_instance=tools,
    vision=True  # Enable vision
)
```

Benefits include:
- **Visual Analysis**: Screen content understanding
- **UI Element Detection**: Accurate element location
- **Error Verification**: Visual confirmation of actions
- **Complex Navigation**: Better handling of dynamic UIs

## 🎯 Planning System

When reasoning is enabled, the agent uses advanced planning:

```python
agent = DroidAgent(
    goal="Configure device settings",
    llm=llm,
    tools_instance=tools,
    reasoning=True  # Enable planning
)
```

Features:
- **Step Planning**: Break down complex tasks
- **Error Recovery**: Handle unexpected situations
- **Optimization**: Choose efficient approaches
- **Verification**: Validate results

## 🔍 Tracing Support

The tracing system helps monitor execution:

```python
# Start Phoenix server first
# Run 'phoenix serve' in a separate terminal

agent = DroidAgent(
    goal="Your task",
    llm=llm,
    tools_instance=tools,
    enable_tracing=True  # Enable Phoenix tracing
)
```

For detailed information, see the [Execution Tracing](/v2/concepts/tracing) documentation.

## ⚙️ Configuration

```python
from droidrun.agent.droid import DroidAgent
from droidrun.tools import load_tools

# Load tools
tool_list, tools_instance = await load_tools(serial="device_id")

# Create agent
agent = DroidAgent(
    goal="Open Settings and enable dark mode",
    llm=llm,                        # Language model
    tools_instance=tools_instance,  # Tool provider
    tool_list=tool_list,            # Available tools
    vision=True,                    # Enable vision
    reasoning=True,                 # Enable planning
    max_steps=15,                   # Maximum planning steps
    timeout=1000,                   # Overall timeout
    enable_tracing=True,            # Execution tracing
    debug=False                     # Debug mode
)

# Run the agent
result = await agent.run()
```

## 🛠️ Execution Modes

DroidAgent supports two execution modes:

### Direct Execution (reasoning=False)

```python
agent = DroidAgent(
    goal="Take a screenshot",
    llm=llm,
    tools_instance=tools_instance,
    tool_list=tool_list,
    reasoning=False  # No planning
)
```

- Treats goal as a single task
- Directly executes using CodeActAgent
- Suitable for simple, straightforward tasks

### Planning Mode (reasoning=True)

```python
agent = DroidAgent(
    goal="Find and install Twitter app",
    llm=llm,
    tools_instance=tools_instance,
    tool_list=tool_list,
    reasoning=True  # With planning
)
```

- PlannerAgent creates step-by-step plan
- Handles complex, multi-step tasks
- Adaptively updates plan based on results

## 📊 Execution Results

The agent returns detailed execution results:

```python
result = await agent.run()

# Check success
if result["success"]:
    print("Goal completed successfully!")
else:
    print(f"Failed: {result['reason']}")

# Access execution details
print(f"Steps executed: {result['steps']}")
print(f"Task history: {result['task_history']}")
```

## 💡 Best Practices

1. **Use Planning for Complex Tasks**
   - Enable reasoning for multi-step operations
   - Direct mode is faster for simple tasks

2. **Enable Vision When Needed**
   - Use for UI-heavy interactions
   - Provides better screen understanding

3. **Set Appropriate Timeouts**
   - Adjust based on task complexity
   - Consider device performance

4. **Handle Errors Properly**
   - Check task_history for debugging

5. **Memory Usage**
   - Use tools.remember() for important information
   - Agent preserves context between planning iterations