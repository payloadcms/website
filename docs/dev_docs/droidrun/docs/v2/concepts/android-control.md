---
title: 'Android Control'
description: 'Understanding Android device control in DroidRun'
---

# 📱 Android Control

DroidRun provides capabilities for controlling and interacting with Android devices through a streamlined tool system.

## 🔌 Device Connection

Before controlling a device, establish a connection:

<Steps>
  <Step title="Enable USB Debugging">
    Enable Developer options (tap Build number 7 times) and USB debugging in Settings
  </Step>
  <Step title="Connect Device">
    Connect via USB and authorize your computer
  </Step>
  <Step title="Verify Connection">
    ```bash
    droidrun devices
    ```
  </Step>
  <Step title="Optional: Wireless Setup">
    ```bash
    droidrun connect 192.168.1.100
    ```
  </Step>
</Steps>

## 🛠️ Tool System

DroidRun uses a modular tool system for device control:

```python
from droidrun.tools import load_tools
from droidrun.agent.droid import DroidAgent

# Load tools for a device
tool_list, tools_instance = await load_tools(serial="device_id")

# Create agent with tools
agent = DroidAgent(
    goal="Your task",
    llm=llm,
    tools_instance=tools_instance,
    tool_list=tool_list
)
```

## 🎯 Core Capabilities

<CardGroup cols={2}>
  <Card title="UI Interaction" icon="hand-pointer">
    Control UI elements using indexes
  </Card>
  <Card title="App Management" icon="mobile-screen">
    Launch apps and list packages
  </Card>
  <Card title="UI Analysis" icon="magnifying-glass">
    Analyze screen content
  </Card>
  <Card title="Memory Management" icon="brain">
    Store important information
  </Card>
</CardGroup>

## 🖱️ UI Interaction Tools

<AccordionGroup>
  <Accordion title="Element Tapping">
    ```python
    # Get clickable elements
    elements = await tools_instance.get_clickables()
    
    # Tap element by index
    await tools_instance.tap_by_index(1)
    
    # Simplified tap (uses same index system)
    await tools_instance.tap(1)
    ```
  </Accordion>
  
  <Accordion title="Text Input">
    ```python
    # Input text
    await tools_instance.input_text("Hello world")
    ```
  </Accordion>
  
  <Accordion title="Gestures">
    ```python
    # Swipe from one point to another
    await tools_instance.swipe(
        start_x=500, start_y=1500, 
        end_x=500, end_y=500, 
        duration_ms=300
    )
    
    # Press key
    await tools_instance.press_key(4)  # BACK key
    # Common keys: 3 (HOME), 4 (BACK), 24 (VOL UP), 25 (VOL DOWN)
    ```
  </Accordion>
</AccordionGroup>

## 📱 App Management

Control applications with built-in tools:

```python
# Start app
await tools_instance.start_app("com.android.settings")

# List packages (non-system apps)
packages = await tools_instance.list_packages()

# List all packages including system apps
all_packages = await tools_instance.list_packages(include_system_apps=True)
```

## 🔍 UI Analysis

Analyze the device screen:

```python
# Take screenshot
screenshot = await tools_instance.take_screenshot()

# Get clickable elements
elements = await tools_instance.get_clickables()

# Extract all UI elements
await tools_instance.extract("ui_state.json")  # Saves UI state to file

# Get phone state (current activity, keyboard status)
state = await tools_instance.get_phone_state()
```

## 🧠 Memory and Task Management

Store important information for future use:

```python
# Remember important information
await tools_instance.remember("WiFi password is 'example123'")

# Get all remembered information
memory = tools_instance.get_memory()

# Mark task as complete
tools_instance.complete(success=True, reason="Task completed successfully")

# Mark task as failed
tools_instance.complete(success=False, reason="Could not find the element")
```

## 🔄 Advanced Usage

### Multi-Step Operations

```python
async def login_flow(tools):
    # Get screen elements
    elements = await tools.get_clickables()
    
    # Find and tap username field
    await tools.tap_by_index(1)
    
    # Enter username
    await tools.input_text("user@example.com")
    
    # Find and tap password field
    await tools.tap_by_index(2)
    
    # Enter password
    await tools.input_text("password123")
    
    # Find and tap login button
    await tools.tap_by_index(3)
    
    # Wait for success and remember result
    await tools.remember("Successfully logged in")
```

## 💡 Best Practices

1. **Understand Element Structure**
   - Always use `get_clickables()` before tapping elements
   - The index refers to the element's position in the returned list
   - Use screenshot for visual reference when needed

2. **Handle Dynamic Content**
   ```python
   # Good practice
   elements = await tools.get_clickables()
   # Then tap after analyzing the current screen state
   await tools.tap_by_index(1)
   ```

3. **Use Memory for Context**
   ```python
   # Store important information
   await tools.remember("User logged in as admin")
   await tools.remember("Found 5 items in search results")
   ```

4. **Signal Task Completion**
   ```python
   try:
       # Perform operations
       await tools.start_app("com.example.app")
       tools.complete(True, "App started successfully")
   except Exception as e:
       tools.complete(False, f"Failed to start app: {str(e)}")
   ```

## 🔧 Troubleshooting

1. **Connection Issues**
   - Ensure USB debugging is enabled
   - Check device authorization
   - Verify device is listed in `droidrun devices`

2. **Element Interaction Problems**
   - Refresh clickable elements before interaction
   - Verify element indexes match the current screen
   - Take screenshot to confirm what's visible

3. **App Control Issues**
   - Use correct package names (verify with `list_packages()`)
   - Ensure app is installed on the device
   - Check for permission issues
