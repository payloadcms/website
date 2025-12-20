---
title: 'Android Control'
description: 'Understanding Android device control in DroidRun'
---

# 📱 Android Control

DroidRun provides powerful capabilities for controlling and interacting with Android devices. This guide explains the available interactions and best practices.

## 🔌 Device Connection

Before controlling a device, you need to establish a connection:

<Steps>
  <Step title="Enable USB Debugging">
    On your Android device, go to **Settings → About phone** and tap **Build number** 7 times to enable Developer options. Then go to **Settings → Developer options** and enable **USB debugging**.
  </Step>
  <Step title="Connect via USB">
    Connect your device to your computer with a USB cable and authorize the computer on your device when prompted.
  </Step>
  <Step title="Verify Connection">
    ```bash
    # Check if your device is recognized
    droidrun devices
    ```
  </Step>
</Steps>

### Wireless Connection

For a cable-free experience:

```bash
# First connect via USB, then switch to Wi-Fi
adb tcpip 5555
adb connect 192.168.1.100:5555

# Or with DroidRun
droidrun connect 192.168.1.100
```

## 🖱️ UI Interaction

DroidRun can simulate various user interactions with the device:

### Create agent

```python
from droidrun.agent.react_agent import ReActAgent
# Create a minimal instance of the agent with a specific device serial
agent = ReActAgent(
    llm=llm,
    device_serial="device1", 
)
```

### Tapping

```python
# Tap at specific coordinates
await agent.execute_tool("tap", x=500, y=800)

# CLI equivalent
droidrun "Tap on the button at position (500, 800)"
```

### Swiping

```python
# Swipe from one point to another (e.g., to scroll)
await agent.execute_tool("swipe", start_x=500, start_y=1500, end_x=500, end_y=500)

# CLI equivalent
droidrun "Scroll down on the screen"
```

### Text Input

```python
# Type text into the current field
await agent.execute_tool("input_text", text="Hello world")

# CLI equivalent
droidrun "Type 'Hello world' in the search box"
```

### Key Presses

```python
# Press a system key
await agent.execute_tool("press_key", key="BACK")

# Available keys: HOME, BACK, MENU, POWER, VOLUME_UP, VOLUME_DOWN, etc.
```

## 📊 UI Analysis

DroidRun can analyze the current state of the device UI:

### Screenshots

```python
# Capture the current screen
result = await agent.execute_tool("take_screenshot")

# The screenshot is automatically analyzed by the LLM for future reasoning
```

### Identifying UI Elements

```python
# Get clickable elements on screen
elements = await agent.execute_tool("get_clickables")

# Elements include details like text, position, and element type
```

## 📱 App Management

DroidRun can launch and interact with apps:

### Starting Apps

```python
# Launch an app by package name
await agent.execute_tool("start_app", package_name="com.android.settings")

# CLI equivalent (using natural language)
droidrun "Open the Settings app"
```

### Listing Installed Apps

```python
# Get a list of installed packages
packages = await agent.execute_tool("list_packages")
```

## 💡 Best Practices

### 1. Prefer Natural Language Commands

The CLI allows you to use natural language instead of precise coordinates:

```bash
# Instead of specifying exact coordinates
droidrun "Find and tap on the Settings app icon"
```

### 2. Verify Screen State

Before interacting with UI elements, verify the current screen:

```python
# Take a screenshot to understand current state
await agent.execute_tool("take_screenshot")

# Then get clickable elements
elements = await agent.execute_tool("get_clickables")
```

### 3. Handle Dynamic Content

UI elements may change position. Use relative references when possible:

```bash
# More robust than exact coordinates
droidrun "Find and tap on the button labeled 'Next'"
```

## 🛠️ Advanced Techniques

### Custom Automation Scripts

For complex scenarios, create custom Python scripts:

```python
async def toggle_wifi():
    """Toggle WiFi on/off."""
    # Open settings
    await agent.execute_tool("start_app", package_name="com.android.settings")
    
    # Take screenshot to analyze UI
    await agent.execute_tool("take_screenshot")
    
    # Find and tap on Network & internet
    elements = await agent.execute_tool("get_clickables")
    # Find network settings element and tap it
    # ...
```

### Multi-Device Control

DroidRun supports controlling multiple devices:

```python

# Specify a particular device
agent1 = ReActAgent(
    task="Open settings",
    llm=llm,
    device_serial="device1"  # Specific device ID
)

agent2 = ReActAgent(
    task="Open settings",
    llm=llm,
    device_serial="device2"  # Specific device ID
)
```
