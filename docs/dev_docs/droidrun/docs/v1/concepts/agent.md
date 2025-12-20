---
title: 'ReAct Agent'
description: 'Understanding the ReAct Agent system in DroidRun'
---

# 🤖 ReAct Agent

DroidRun uses a ReAct (Reasoning + Acting) agent to control Android devices. This powerful approach combines LLM reasoning with concrete actions to achieve complex automation tasks.

## 📚 What is ReAct?

ReAct is a framework that combines:

- **Reasoning**: Using an LLM to interpret tasks, make decisions, and plan steps
- **Acting**: Executing concrete actions on an Android device
- **Observing**: Getting feedback from actions to inform future reasoning

This loop of reasoning, acting, and observing allows the agent to handle complex, multi-step tasks on Android devices.

## 🔄 The ReAct Loop

<Steps>
  <Step title="Goal Setting">
    The user provides a natural language task like "Open settings and enable dark mode"
  </Step>
  <Step title="Reasoning">
    The LLM analyzes the task and determines what steps are needed
  </Step>
  <Step title="Action Selection">
    The agent selects an appropriate action (e.g., tapping a UI element)
  </Step>
  <Step title="Execution">
    The action is executed on the Android device
  </Step>
  <Step title="Observation">
    The agent observes the result (e.g., a new screen appears)
  </Step>
  <Step title="Further Reasoning">
    The agent evaluates progress and decides on the next action
  </Step>
</Steps>

This cycle repeats until the task is completed or the maximum number of steps is reached.

## 🛠️ Available Actions

The ReAct agent can perform various actions on Android devices:

<AccordionGroup>
  <Accordion title="UI Interaction">
    - `tap(index)` - Tap on a UI element by its index
    - `swipe(start_x, start_y, end_x, end_y)` - Swipe from one point to another
    - `input_text(text)` - Type text into the current field
    - `press_key(keycode)` - Press a specific key (e.g., HOME, BACK)
  </Accordion>

  <Accordion title="App Management">
    - `start_app(package)` - Launch an app by package name
    - `list_packages()` - List installed packages
    - `install_app(apk_path)` - Install an app from APK
    - `uninstall_app(package)` - Uninstall an app
  </Accordion>

  <Accordion title="UI Analysis">
    - `take_screenshot()` - Capture the current screen (vision mode only)
    - `get_clickables()` - Identify clickable elements on screen
    - `extract(filename)` - Save complete UI state to a JSON file
  </Accordion>

  <Accordion title="Task Management">
    - `complete(result)` - Mark the task as complete with a summary
  </Accordion>
</AccordionGroup>

## 📸 Vision Capabilities

When vision mode is enabled, the ReAct agent can analyze screenshots to better understand the UI:

```python
agent = ReActAgent(
    task="Open settings and enable dark mode",
    llm=llm_instance,
    vision=True  # Enable vision capabilities
)
```

This provides several benefits:

- **Visual Context**: The LLM can see exactly what's on screen
- **Better UI Understanding**: Recognizes UI elements even if text detection is imperfect
- **Complex Navigation**: Handles apps with unusual or complex interfaces more effectively

## 📊 Token Usage Tracking

The ReAct agent now tracks token usage for all LLM interactions:

```python
# After running the agent
stats = llm.get_token_usage_stats()
print(f"Total tokens: {stats['total_tokens']}")
print(f"API calls: {stats['api_calls']}")
```

This information is useful for:

- **Cost Management**: Track and optimize your API usage costs
- **Performance Tuning**: Identify steps that require the most tokens
- **Troubleshooting**: Debug issues with prompt sizes or response lengths

## 🧠 Agent Parameters

When creating a ReAct agent, you can configure several parameters:

```python
agent = ReActAgent(
    task="Open settings and enable dark mode",  # The goal to achieve
    llm=llm_instance,                           # LLM to use for reasoning
    device_serial="DEVICE123",                  # Optional specific device
    max_steps=15,                               # Maximum steps to attempt
    vision=False                                # Whether to enable vision capabilities
)
```

## 📊 Step Types

The agent records its progress using different step types:

- **Thought**: Internal reasoning about what to do
- **Action**: An action to be executed on the device
- **Observation**: Result of an action
- **Plan**: A sequence of steps to achieve the goal
- **Goal**: The target state to achieve

## 💡 Best Practices

1. **Clear Goals**: Provide specific, clear instructions
2. **Realistic Tasks**: Break complex automation into manageable tasks
3. **Vision for Complex UIs**: Enable vision mode for complex UI navigation
4. **Step Limits**: Set reasonable max_steps to prevent infinite loops
5. **Device Connectivity**: Ensure stable connection to your device
6. **Token Optimization**: Monitor token usage for cost-effective automation