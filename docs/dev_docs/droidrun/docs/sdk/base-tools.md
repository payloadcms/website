---
title: Tools Base Class
---

Abstract base class defining the interface for device control tools.

<a id="droidrun.tools.tools.Tools"></a>

## Tools

```python
class Tools(ABC)
```

Abstract base class for all device control tools.

This class defines the contract that all tool implementations must follow. It provides:
- 14 abstract methods for device interaction (UI, apps, state, memory)
- `@ui_action` decorator for automatic trajectory recording
- Consistent interface across platforms (Android, iOS)

All implementations must provide these methods to ensure compatibility with DroidAgent and other agents.

---

## Quick Reference

**14 Abstract Methods:**
- `get_state()`, `get_date()`, `tap_by_index()`, `swipe()`, `drag()`, `input_text()`, `back()`, `press_key()`, `start_app()`, `take_screenshot()`, `list_packages()`, `get_apps()`, `remember()`, `get_memory()`, `complete()`, `_extract_element_coordinates_by_index()`

**Key Attributes:**
- `save_trajectories`: `"none"` | `"step"` | `"action"` - Controls automatic screenshot capture
- `memory`: `List[str]` - Stores remembered information
- `finished`, `success`, `reason` - Task completion state

**Decorator:**
- `@Tools.ui_action` - Captures screenshots when `save_trajectories="action"`

---

## Architecture

The Tools architecture follows a 2-layer pattern:

1. **Abstract Layer** (`tools.py`): Defines the `Tools` abstract base class with method signatures and the `@ui_action` decorator
2. **Implementation Layer**: Platform-specific implementations
   - `adb.py`: `AdbTools` for Android devices using ADB and Portal app (TCP or content provider)
   - `ios.py`: `IOSTools` for iOS devices using HTTP API to communicate with Portal app

**Key Components:**

- **Tools ABC**: Defines 14 abstract methods that all implementations must provide
- **@ui_action decorator**: Automatically captures screenshots and UI states when `save_trajectories="action"`
- **Portal integration**: Android uses `PortalClient` (TCP or content provider), iOS uses HTTP API

This design ensures:
- Consistent API across platforms
- Easy addition of new device types
- Type safety and IDE support
- Automatic trajectory recording for debugging
- Clear contract for implementing new tools

---

## Common Interface

All Tools implementations must provide these methods:

### UI Interaction

- `tap_by_index(index: int) -> str` - Tap element by index
- `swipe(start_x: int, start_y: int, end_x: int, end_y: int, duration_ms: int = 300) -> bool` - Swipe gesture
- `drag(start_x: int, start_y: int, end_x: int, end_y: int, duration_ms: int = 3000) -> bool` - Drag gesture
- `input_text(text: str, index: int = -1, clear: bool = False) -> str` - Text input
- `back() -> str` - Back navigation
- `press_key(keycode: int) -> str` - Key press

### App Management

- `start_app(package: str, activity: str = "") -> str` - Launch app
- `list_packages(include_system_apps: bool = False) -> List[str]` - List packages
- `get_apps(include_system_apps: bool = True) -> List[Dict[str, Any]]` - Get apps with labels

### State Retrieval

- `get_state() -> Dict[str, Any]` - Get UI state and accessibility tree
- `get_date() -> str` - Get device date/time
- `take_screenshot() -> Tuple[str, bytes]` - Capture screenshot

### Memory and Completion

- `remember(information: str) -> str` - Store context information
- `get_memory() -> List[str]` - Retrieve stored memory
- `complete(success: bool, reason: str) -> None` - Mark task complete

### Internal Helpers

- `_extract_element_coordinates_by_index(index: int) -> Tuple[int, int]` - Extract element coordinates

---

## Decorator: @ui_action

<a id="droidrun.tools.tools.Tools.ui_action"></a>

```python
@staticmethod
def ui_action(func)
```

Decorator to capture screenshots and UI states for actions that modify the UI.

This decorator automatically handles trajectory recording when `save_trajectories="action"` is enabled. It captures screenshots and UI states after each UI action for debugging and analysis.

**Usage:**

```python
class MyTools(Tools):
    @Tools.ui_action
    def tap_by_index(self, index: int) -> str:
        # Perform tap action
        result = self._perform_tap(index)

        # Screenshot and UI state automatically captured after return
        return result
```

**Behavior:**

1. Method executes normally and returns its result
2. After method returns, decorator checks if `self.save_trajectories == "action"`
3. If true, it looks for `step_screenshots` and `step_ui_states` in caller's global scope (using `sys._getframe(1)`)
4. If these lists exist, appends current screenshot (`self.take_screenshot()[1]`) and UI state (`self.get_state()`)
5. Enables action replay and debugging by building a complete trajectory

**Important:** The Tools instance must have `save_trajectories` attribute set to `"action"` for the decorator to capture screenshots. Other values (`"none"`, `"step"`) will skip automatic capture.

**Standard decorated methods in AdbTools:**

- `_extract_element_coordinates_by_index()` - Extract element coordinates
- `swipe()` - Swipe gesture
- `drag()` - Drag gesture
- `input_text()` - Text input
- `back()` - Back button
- `press_key()` - Key press
- `start_app()` - Launch app
- `complete()` - Mark task complete

Note: `tap_by_index()` is NOT decorated with `@ui_action` in the current implementation. The decorator is only applied to the internal `_extract_element_coordinates_by_index()` method that `tap_by_index()` calls.

---

## Custom Tool Integration

You can extend Tools to add platform-specific functionality or create custom tool implementations.

### Extending Existing Tools

```python
from droidrun.tools import AdbTools
from typing import List

class CustomAndroidTools(AdbTools):
    """Custom Android tools with additional methods."""

    def read_notifications(self) -> List[str]:
        """Read all notifications from notification shade."""
        # Swipe down to open notifications
        self.swipe(540, 0, 540, 500)

        # Get UI state
        state = self.get_state()

        # Extract notification texts
        notifications = []
        for element in state['a11y_tree']:
            if 'notification' in element['className'].lower():
                if element['text']:
                    notifications.append(element['text'])

        # Close notifications
        self.back()

        return notifications

# Usage
tools = CustomAndroidTools(serial="emulator-5554")
notifications = tools.read_notifications()
```

### Creating New Tool Implementations

To create a custom Tools implementation, you must implement all 14 abstract methods:

```python
from droidrun.tools import Tools
from typing import Any, Dict, List, Tuple

class CustomTools(Tools):
    """Custom tools implementation."""

    def __init__(self):
        self.memory: List[str] = []
        self.finished = False
        self.success = None
        self.reason = None
        self.save_trajectories = "none"

    # Required abstract methods:
    def get_state(self) -> Dict[str, Any]:
        """Return dict with 'a11y_tree' and 'phone_state' keys."""
        pass

    def get_date(self) -> str:
        """Return device date/time as string."""
        pass

    def tap_by_index(self, index: int) -> str:
        """Tap element at given index."""
        pass

    def swipe(self, start_x: int, start_y: int, end_x: int, end_y: int, duration_ms: int = 300) -> bool:
        """Perform swipe gesture."""
        pass

    def drag(self, start_x: int, start_y: int, end_x: int, end_y: int, duration_ms: int = 3000) -> bool:
        """Perform drag gesture."""
        pass

    def input_text(self, text: str, index: int = -1, clear: bool = False) -> str:
        """Input text."""
        pass

    def back(self) -> str:
        """Navigate back."""
        pass

    def press_key(self, keycode: int) -> str:
        """Press key by keycode."""
        pass

    def start_app(self, package: str, activity: str = "") -> str:
        """Launch app."""
        pass

    def take_screenshot(self) -> Tuple[str, bytes]:
        """Return tuple of (format, image_bytes)."""
        pass

    def list_packages(self, include_system_apps: bool = False) -> List[str]:
        """List installed packages."""
        pass

    def get_apps(self, include_system_apps: bool = True) -> List[Dict[str, Any]]:
        """Get apps with package and label."""
        pass

    def remember(self, information: str) -> str:
        """Store information in memory."""
        self.memory.append(information)
        return f"Remembered: {information}"

    def get_memory(self) -> List[str]:
        """Retrieve stored memory."""
        return self.memory.copy()

    def complete(self, success: bool, reason: str = "") -> None:
        """Mark task as complete."""
        self.finished = True
        self.success = success
        self.reason = reason

    def _extract_element_coordinates_by_index(self, index: int) -> Tuple[int, int]:
        """Extract element coordinates by index."""
        pass
```

---

## Helper Function: describe_tools

<a id="droidrun.tools.tools.describe_tools"></a>

```python
def describe_tools(
    tools: Tools,
    exclude_tools: Optional[List[str]] = None
) -> Dict[str, Callable[..., Any]]
```

Describe the tools available for the given Tools instance.

This function creates a dictionary mapping tool names to their callable methods, useful for introspection and dynamic tool loading.

**Arguments**:

- `tools` _Tools_ - The Tools instance to describe
- `exclude_tools` _Optional[List[str]]_ - List of tool names to exclude from the description

**Returns**:

- `Dict[str, Callable[..., Any]]` - Dictionary mapping tool names to their methods

**Usage:**

```python
from droidrun.tools import AdbTools, describe_tools

tools = AdbTools()

# Get all available tools
available = describe_tools(tools)
print(available.keys())
# Output: dict_keys(['swipe', 'input_text', 'press_key', 'tap_by_index', 'drag',
#                    'start_app', 'list_packages', 'remember', 'complete'])

# Exclude certain tools
limited = describe_tools(tools, exclude_tools=['drag', 'press_key'])
print(limited.keys())
# Output: dict_keys(['swipe', 'input_text', 'tap_by_index', 'start_app',
#                    'list_packages', 'remember', 'complete'])

# Use tool dynamically
tool_name = "tap_by_index"
if tool_name in available:
    result = available[tool_name](5)
```

**Included tools:**

- UI interaction: `swipe`, `input_text`, `press_key`, `tap_by_index`, `drag`
- App management: `start_app`, `list_packages`
- State management: `remember`, `complete`

**Not included by default:**

- `get_state()` - Called internally by agents
- `take_screenshot()` - Called internally by agents
- `get_memory()` - Accessed directly by agents
- `back()` - Typically handled by agents or wrapped in other tools

---

## Tool Communication with Agents

Tools instances are passed to agents and provide the atomic actions for device control. Agents call these methods directly or wrap them for LLM function calling.

### How Agents Use Tools:

```python
from droidrun import DroidAgent
from droidrun.tools import AdbTools
from droidrun.config_manager import DroidrunConfig

# Create tools instance
tools = AdbTools(serial="emulator-5554")

# Create config
config = DroidrunConfig()

# Pass to agent
agent = DroidAgent(
    goal="Open Settings app",
    tools=tools,  # Agent uses these methods
    config=config
)

# Inside agent execution:
# 1. Agent calls tools.get_state() to get UI
# 2. Agent analyzes state and decides action
# 3. Agent calls tools.tap_by_index(5) to tap element
# 4. Agent uses tools.remember() to store context
# 5. Agent calls tools.complete() when done
```

### Tools are used via describe_tools():

The `describe_tools()` function extracts callable methods for LLM function calling:

```python
from droidrun.tools import describe_tools

tools = AdbTools()
tool_dict = describe_tools(tools)

# Returns: {'swipe': <method>, 'input_text': <method>, 'tap_by_index': <method>, ...}
# Agents use this dict to expose tools as LLM functions
```

---

## Platform Comparison

| Feature | AdbTools (Android) | IOSTools (iOS) |
|---------|-------------------|----------------|
| Connection | ADB + Portal (USB/TCP) | HTTP (Portal app) |
| Element indexing | ✅ Full support | ✅ Full support |
| Text input | ✅ Unicode + index/clear | ⚠️ Unicode only (no index/clear) |
| Screenshots | ✅ Fast (PNG) | ✅ Fast (PNG) |
| Swipe | ✅ Precise coordinates | ⚠️ Direction-based |
| Drag | ✅ Full support | ❌ Not implemented |
| Back button | ✅ Hardware key (keycode 4) | ❌ Not implemented |
| `get_date()` | ✅ Device date/time | ❌ Not implemented |
| `get_apps()` | ✅ All packages with labels | ❌ Not implemented |
| App packages | ✅ All packages | ⚠️ Limited to configured |
| Key codes | ✅ Full Android keycodes | ⚠️ Limited (HOME/ACTION/CAMERA) |
| State retrieval | ✅ Accessibility tree + phone state | ✅ Accessibility tree + phone state |
| `_extract_element_coordinates_by_index()` | ✅ Implemented | ❌ Not implemented |

---

## Best Practices

### 1. Always call get_state() before tap_by_index()

The `tap_by_index()` method relies on cached UI elements from the last `get_state()` call:

```python
# Correct
state = tools.get_state()
tools.tap_by_index(5)

# Wrong - will fail with "No UI elements cached"
tools.tap_by_index(5)
```

### 2. Use remember() for important context

```python
# Store facts that should persist across steps
tools.remember("User's email: user@example.com")
tools.remember("Login successful")

# Agents include memory in subsequent prompts
```

### 3. Enable trajectory recording for debugging

```python
# Set save_trajectories to "action" for automatic screenshot capture
tools.save_trajectories = "action"

# Now all @ui_action decorated methods capture screenshots
tools.swipe(100, 500, 100, 100)  # Auto-captured
tools.input_text("test")          # Auto-captured

# Access captured data
for screenshot in tools.screenshots:
    print(f"Timestamp: {screenshot['timestamp']}")
```

### 4. Handle platform differences

```python
from droidrun.tools import AdbTools, IOSTools

if isinstance(tools, AdbTools):
    tools.press_key(4)  # Android back button
elif isinstance(tools, IOSTools):
    # iOS doesn't have back button - find in UI
    state = tools.get_state()
    for elem in state['a11y_tree']:
        if 'back' in elem.get('label', '').lower():
            tools.tap_by_index(elem['index'])
```

### 5. Use complete() to signal task finish

```python
# Always call complete() to mark task as finished
tools.complete(success=True, reason="Task completed")

# On failure, reason is required
tools.complete(success=False, reason="Login button not found")
```

---

## Error Handling

Tools methods use consistent error handling patterns:

**String returns with error messages:**
```python
result = tools.tap_by_index(999)
if result.startswith("Error:"):
    print(f"Tap failed: {result}")
```

**Boolean returns:**
```python
success = tools.swipe(100, 500, 100, 100)
if not success:
    print("Swipe failed")
```

**Exceptions for critical errors:**
```python
try:
    format, screenshot = tools.take_screenshot()
except ValueError as e:
    print(f"Screenshot failed: {e}")
```

---

## Advanced: Stacking Decorators

You can combine `@Tools.ui_action` with custom decorators:

```python
import logging
from functools import wraps
from droidrun.tools import AdbTools, Tools

def log_action(func):
    """Decorator to log all tool actions."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        logger = logging.getLogger("tools")
        logger.info(f"Calling {func.__name__} with args={args[1:]}")

        result = func(*args, **kwargs)

        logger.info(f"{func.__name__} returned: {result}")
        return result
    return wrapper

class LoggedAdbTools(AdbTools):
    @log_action         # Applied first (outer)
    @Tools.ui_action    # Applied second (inner)
    def swipe(self, start_x: int, start_y: int, end_x: int, end_y: int, duration_ms: int = 300) -> bool:
        return super().swipe(start_x, start_y, end_x, end_y, duration_ms)

# Usage
tools = LoggedAdbTools(serial="emulator-5554")
tools.save_trajectories = "action"
tools.swipe(100, 500, 100, 100)  # Logs + captures screenshot
```

**Decorator order matters:** Place `@Tools.ui_action` closest to the function definition so it executes last (captures screenshot after all other decorators).

---

## See Also

- [AdbTools API](/v4/sdk/adb-tools) - Android implementation
- [IOSTools API](/v4/sdk/ios-tools) - iOS implementation
- [DroidAgent API](/v4/sdk/droid-agent) - Agent integration
- [Custom Tools Guide](/v4/guides/custom-tools-credentials) - Creating custom tools
