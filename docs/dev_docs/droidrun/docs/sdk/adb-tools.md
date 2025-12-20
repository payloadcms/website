---
title: AdbTools
---

UI Actions - Core UI interaction tools for Android device control via ADB.

<a id="droidrun.tools.adb.AdbTools"></a>

## AdbTools

```python
class AdbTools(Tools)
```

Core UI interaction tools for Android device control.

AdbTools provides a comprehensive interface for interacting with Android devices through ADB (Android Debug Bridge). It supports both TCP communication and content provider modes for device communication via the Droidrun Portal app.

<a id="droidrun.tools.adb.AdbTools.__init__"></a>

#### AdbTools.\_\_init\_\_

```python
def __init__(
    serial: str | None = None,
    use_tcp: bool = False,
    remote_tcp_port: int = 8080,
    app_opener_llm=None,
    text_manipulator_llm=None,
    credential_manager=None
) -> None
```

Initialize the AdbTools instance.

**Arguments**:

- `serial` _str | None_ - Device serial number (e.g., "emulator-5554", "192.168.1.100:5555"). If None, auto-detects the first available device.
- `use_tcp` _bool_ - Whether to prefer TCP communication (default: False). TCP is faster but requires port forwarding. Falls back to content provider mode if TCP fails.
- `remote_tcp_port` _int_ - TCP port for Portal app communication on device (default: 8080)
- `app_opener_llm` _LLM | None_ - LLM instance for app opening workflow (optional). Used by helper tools to open apps by natural language description.
- `text_manipulator_llm` _LLM | None_ - LLM instance for text manipulation (optional). Used by helper tools for text editing operations.
- `credential_manager` _CredentialManager | None_ - CredentialManager instance for secret handling (optional). Enables secure credential access in automation workflows.

**Usage:**

```python
from droidrun.tools import AdbTools

# Auto-detect device
tools = AdbTools()

# Specific device
tools = AdbTools(serial="emulator-5554")

# TCP mode (faster communication, requires port forwarding)
tools = AdbTools(serial="emulator-5554", use_tcp=True)

# With LLM support for advanced workflows
from llama_index.llms.openai import OpenAI
llm = OpenAI(model="gpt-4")
tools = AdbTools(
    serial="emulator-5554",
    app_opener_llm=llm,
    text_manipulator_llm=llm
)
```

**Notes:**
- Automatically sets up the Droidrun Portal keyboard on initialization via `setup_keyboard()`
- Creates a PortalClient instance that handles TCP/content provider communication
- Device serial can be emulator name, USB serial, or TCP/IP address:port

---

## UI Interaction Methods

<a id="droidrun.tools.adb.AdbTools.tap_by_index"></a>

#### AdbTools.tap\_by\_index

```python
def tap_by_index(index: int) -> str
```

Tap on a UI element by its index.

This function uses the cached clickable elements to find the element with the given index and tap on its center coordinates.

**Arguments**:

- `index` _int_ - Index of the element to tap (from accessibility tree)

**Returns**:

- `str` - Result message describing the tapped element

**Usage:**

```python
# Get UI state to populate element cache
state = tools.get_state()

# Tap element at index 5
result = tools.tap_by_index(5)
print(result)
# Output: "Tapped element with index 5 | Text: 'Submit' | Class: android.widget.Button | Type: clickable | Coordinates: (540, 960)"
```

**Notes:**
- Call `get_state()` first to populate the clickable elements cache
- Returns descriptive error message (not raises exception) if element index is invalid
- Error message includes up to 20 available indices to help with debugging
- Automatically searches nested children for the target index
- Returns detailed information about tapped element including text, class, type, and child content

<a id="droidrun.tools.adb.AdbTools.tap_by_coordinates"></a>

#### AdbTools.tap\_by\_coordinates

```python
def tap_by_coordinates(x: int, y: int) -> bool
```

Tap on the device screen at specific coordinates.

**Arguments**:

- `x` _int_ - X coordinate
- `y` _int_ - Y coordinate

**Returns**:

- `bool` - True if tap succeeded, False otherwise

**Usage:**

```python
# Tap at specific screen coordinates
success = tools.tap_by_coordinates(540, 960)
```

<a id="droidrun.tools.adb.AdbTools.tap"></a>

#### AdbTools.tap

```python
def tap(index: int) -> str
```

Tap on a UI element by its index.

Alias for `tap_by_index()`. This function uses the cached clickable elements from the last `get_state()` call to find the element with the given index and tap on its center coordinates.

**Arguments**:

- `index` _int_ - Index of the element to tap

**Returns**:

- `str` - Result message

<a id="droidrun.tools.adb.AdbTools.swipe"></a>

#### AdbTools.swipe

```python
def swipe(
    start_x: int,
    start_y: int,
    end_x: int,
    end_y: int,
    duration_ms: float = 300
) -> bool
```

Performs a straight-line swipe gesture on the device screen.

To perform a hold (long press), set the start and end coordinates to the same values and increase the duration as needed.

**Arguments**:

- `start_x` _int_ - Starting X coordinate
- `start_y` _int_ - Starting Y coordinate
- `end_x` _int_ - Ending X coordinate
- `end_y` _int_ - Ending Y coordinate
- `duration_ms` _float_ - Duration of swipe in milliseconds (default: 300)

**Returns**:

- `bool` - True if swipe succeeded, False otherwise

**Usage:**

```python
# Swipe up (scroll down content)
tools.swipe(540, 1500, 540, 500, duration_ms=300)

# Swipe left
tools.swipe(800, 960, 200, 960, duration_ms=250)

# Long press (hold for 2 seconds at same position)
tools.swipe(540, 960, 540, 960, duration_ms=2000)
```

**Notes:**
- Emits SwipeActionEvent when context is set for trajectory tracking
- Uses `@Tools.ui_action` decorator for automatic screenshot capture
- Duration is converted to seconds internally (dividing by 1000)

<a id="droidrun.tools.adb.AdbTools.drag"></a>

#### AdbTools.drag

```python
def drag(
    start_x: int,
    start_y: int,
    end_x: int,
    end_y: int,
    duration: float = 3
) -> bool
```

Performs a straight-line drag and drop gesture on the device screen.

**Arguments**:

- `start_x` _int_ - Starting X coordinate
- `start_y` _int_ - Starting Y coordinate
- `end_x` _int_ - Ending X coordinate
- `end_y` _int_ - Ending Y coordinate
- `duration` _float_ - Duration of drag in seconds (default: 3)

**Returns**:

- `bool` - True if drag succeeded, False otherwise

**Usage:**

```python
# Drag element from one position to another (3 second duration)
tools.drag(200, 500, 800, 1200, duration=3)

# Faster drag (1 second)
tools.drag(200, 500, 800, 1200, duration=1)
```

**Notes:**
- Emits DragActionEvent when context is set for trajectory tracking
- Uses `@Tools.ui_action` decorator for automatic screenshot capture
- Includes sleep after drag operation to allow UI to settle

<a id="droidrun.tools.adb.AdbTools.input_text"></a>

#### AdbTools.input\_text

```python
def input_text(text: str, index: int = -1, clear: bool = False) -> str
```

Input text on the device.

Always make sure that a text field is focused before inputting text.

**Arguments**:

- `text` _str_ - Text to input. Can contain spaces, newlines, and special characters including non-ASCII.
- `index` _int_ - Index of the element to input text into. If -1, uses the currently focused element (default: -1).
- `clear` _bool_ - Whether to clear existing text before inputting (default: False)

**Returns**:

- `str` - Result message

**Usage:**

```python
# Focus element first, then input text
tools.tap_by_index(3)  # Focus text field
result = tools.input_text("Hello World")

# Input into specific element by index
result = tools.input_text("user@example.com", index=5)

# Clear existing text and input new text
result = tools.input_text("New text", index=5, clear=True)

# Unicode support
result = tools.input_text("你好世界")  # Chinese characters
result = tools.input_text("Hello\nWorld")  # Multiline text
```

**Notes:**
- Always ensure a text field is focused before inputting text (use `tap_by_index()` or set `index` parameter)
- Uses the Droidrun Portal app keyboard for reliable text input via PortalClient
- Supports Unicode characters and special characters including non-ASCII
- If `index != -1`, automatically taps the element first before inputting text
- Call `get_state()` first to populate element cache if using `index` parameter
- Emits InputTextActionEvent when context is set for trajectory tracking
- Uses `@Tools.ui_action` decorator for automatic screenshot capture
- Text longer than 50 characters is truncated in result message (but fully input to device)

<a id="droidrun.tools.adb.AdbTools.back"></a>

#### AdbTools.back

```python
def back() -> str
```

Go back on the current view.

This presses the Android back button (keycode 4).

**Returns**:

- `str` - Result message

**Usage:**

```python
result = tools.back()  # Press back button
print(result)  # Output: "Pressed key BACK"
```

**Notes:**
- Uses Android keycode 4 (KEYCODE_BACK)
- Emits KeyPressActionEvent when context is set for trajectory tracking
- Uses `@Tools.ui_action` decorator for automatic screenshot capture

<a id="droidrun.tools.adb.AdbTools.press_key"></a>

#### AdbTools.press\_key

```python
def press_key(keycode: int) -> str
```

Press a key on the Android device.

**Common keycodes:**
- `3`: HOME
- `4`: BACK
- `66`: ENTER
- `67`: DELETE

Full keycode reference: [Android KeyEvent Documentation](https://developer.android.com/reference/android/view/KeyEvent)

**Arguments**:

- `keycode` _int_ - Android keycode to press

**Returns**:

- `str` - Result message with key name

**Usage:**

```python
# Press enter
result = tools.press_key(66)
print(result)  # Output: "Pressed key ENTER"

# Press home button
tools.press_key(3)  # Output: "Pressed key HOME"

# Press back button
tools.press_key(4)  # Output: "Pressed key BACK"

# Press delete
tools.press_key(67)  # Output: "Pressed key DELETE"

# Unknown keycodes display as number
tools.press_key(999)  # Output: "Pressed key 999"
```

**Notes:**
- Common keycodes (3, 4, 66, 67) are mapped to readable names (HOME, BACK, ENTER, DELETE)
- Emits KeyPressActionEvent when context is set for trajectory tracking
- Uses `@Tools.ui_action` decorator for automatic screenshot capture

---

## App Management Methods

<a id="droidrun.tools.adb.AdbTools.start_app"></a>

#### AdbTools.start\_app

```python
def start_app(package: str, activity: str | None = None) -> str
```

Start an app on the device.

If activity is not provided, automatically resolves the main/launcher activity using `cmd package resolve-activity`.

**Arguments**:

- `package` _str_ - Package name (e.g., "com.android.settings", "com.google.android.apps.messaging")
- `activity` _str | None_ - Optional activity name (e.g., ".Settings"). If None, auto-detects the main launcher activity.

**Returns**:

- `str` - Result message indicating success or error

**Usage:**

```python
# Auto-detect main activity
result = tools.start_app("com.android.settings")
print(result)
# Output: "App started: com.android.settings with activity .Settings"

# Specific activity
result = tools.start_app("com.android.settings", ".Settings")

# Chrome browser (auto-detects launcher activity)
result = tools.start_app("com.android.chrome")
```

**Notes:**
- Uses `cmd package resolve-activity --brief` to auto-detect main activity when not specified
- Emits StartAppEvent when context is set for trajectory tracking

<a id="droidrun.tools.adb.AdbTools.install_app"></a>

#### AdbTools.install\_app

```python
def install_app(
    apk_path: str,
    reinstall: bool = False,
    grant_permissions: bool = True
) -> str
```

Install an app on the device.

**Arguments**:

- `apk_path` _str_ - Path to the APK file on the local machine
- `reinstall` _bool_ - Whether to reinstall if app already exists (default: False)
- `grant_permissions` _bool_ - Whether to grant all permissions automatically (default: True)

**Returns**:

- `str` - Result message indicating success or error

**Usage:**

```python
# Install new app
result = tools.install_app("/path/to/app.apk")
print(result)

# Reinstall existing app
result = tools.install_app("/path/to/app.apk", reinstall=True)

# Install without granting permissions
result = tools.install_app("/path/to/app.apk", grant_permissions=False)
```

**Notes:**
- APK file must exist on the local machine (not on device)
- Returns error message if APK file is not found
- With `grant_permissions=True`, automatically grants runtime permissions via `-g` flag

<a id="droidrun.tools.adb.AdbTools.list_packages"></a>

#### AdbTools.list\_packages

```python
def list_packages(include_system_apps: bool = False) -> List[str]
```

List installed packages on the device.

**Arguments**:

- `include_system_apps` _bool_ - Whether to include system apps (default: False)

**Returns**:

- `List[str]` - List of package names

**Usage:**

```python
# User-installed apps only
packages = tools.list_packages()
print(packages)
# Output: ['com.example.app1', 'com.example.app2', ...]

# Include system apps
all_packages = tools.list_packages(include_system_apps=True)
```

<a id="droidrun.tools.adb.AdbTools.get_apps"></a>

#### AdbTools.get\_apps

```python
def get_apps(include_system: bool = True) -> List[Dict[str, str]]
```

Get installed apps with package name and human-readable label.

**Arguments**:

- `include_system` _bool_ - Whether to include system apps (default: True)

**Returns**:

- `List[Dict[str, str]]` - List of dictionaries containing 'package' and 'label' keys

**Usage:**

```python
apps = tools.get_apps(include_system=False)
for app in apps:
    print(f"{app['label']}: {app['package']}")

# Output:
# Chrome: com.android.chrome
# Gmail: com.google.android.gm
# Messages: com.google.android.apps.messaging
```

---

## State and Screenshot Methods

<a id="droidrun.tools.adb.AdbTools.get_state"></a>

#### AdbTools.get\_state

```python
def get_state() -> Dict[str, Any]
```

Get both the accessibility tree and phone state in a single call.

This is the primary method for retrieving UI information from the device. It combines accessibility tree (UI elements) and phone state (current activity, keyboard visibility) into a single response. This method also populates the internal `clickable_elements_cache` used by `tap_by_index()`.

**Returns**:

- `Dict[str, Any]` - Dictionary containing both 'a11y_tree' and 'phone_state' data:
  - `a11y_tree`: List of UI elements with indices, text, class names, bounds, etc.
  - `phone_state`: Current activity name, keyboard visibility, etc.

**Usage:**

```python
state = tools.get_state()

# Access accessibility tree
for element in state['a11y_tree']:
    print(f"Index {element['index']}: {element['text']} ({element['className']})")

# Access phone state
current_activity = state['phone_state']['current_activity']
keyboard_shown = state['phone_state']['keyboard_shown']

print(f"Current activity: {current_activity}")
print(f"Keyboard visible: {keyboard_shown}")
```

**Element structure:**

```python
{
    "index": 5,
    "className": "android.widget.Button",
    "text": "Submit",
    "bounds": "100,200,300,400",  # left,top,right,bottom
    "clickable": True,
    "children": []  # Nested elements (if any)
}
```

**Phone state structure:**

```python
{
    "current_activity": "com.android.chrome/.MainActivity",
    "keyboard_shown": False
}
```

**Notes:**
- Always call this method before using `tap_by_index()` to populate the element cache
- The `type` attribute is filtered out from elements in the returned tree
- Uses PortalClient which automatically selects TCP or content provider mode

<a id="droidrun.tools.adb.AdbTools.take_screenshot"></a>

#### AdbTools.take\_screenshot

```python
def take_screenshot(hide_overlay: bool = True) -> Tuple[str, bytes]
```

Take a screenshot of the device.

This function captures the current screen and stores the screenshot with timestamp for trajectory recording. Screenshots are automatically stored in the `screenshots` list with timestamp information.

**Arguments**:

- `hide_overlay` _bool_ - Whether to hide Portal app overlay elements during screenshot (default: True)

**Returns**:

- `Tuple[str, bytes]` - Tuple of (format, image_bytes) where format is "PNG" and image_bytes is the PNG image data

**Usage:**

```python
# Take screenshot (hides Portal overlay by default)
format, image_bytes = tools.take_screenshot()
print(f"Screenshot format: {format}")  # Output: "PNG"

# Save to file
with open("screenshot.png", "wb") as f:
    f.write(image_bytes)

# Take screenshot with overlay visible
format, image_bytes = tools.take_screenshot(hide_overlay=False)
```

**Notes:**
- Screenshots are automatically stored in `tools.screenshots` list with timestamp
- Each screenshot entry contains: `{"timestamp": float, "image_data": bytes, "format": "PNG"}`
- Uses PortalClient for screenshot capture

<a id="droidrun.tools.adb.AdbTools.get_date"></a>

#### AdbTools.get\_date

```python
def get_date() -> str
```

Get the current date and time on device.

**Returns**:

- `str` - Date and time string from device

**Usage:**

```python
date = tools.get_date()
print(f"Device date: {date}")
# Output: "Thu Jan 16 14:30:25 UTC 2025"
```

---

## Device Communication Methods

<a id="droidrun.tools.adb.AdbTools.ping"></a>

#### AdbTools.ping

```python
def ping() -> Dict[str, Any]
```

Test the Portal connection.

**Returns**:

- `Dict[str, Any]` - Dictionary with ping result

**Usage:**

```python
result = tools.ping()
if result.get("status") == "ok":
    print("Portal connection successful")
else:
    print(f"Portal connection failed: {result}")
```

---

## Memory and Completion Methods

<a id="droidrun.tools.adb.AdbTools.remember"></a>

#### AdbTools.remember

```python
def remember(information: str) -> str
```

Store important information to remember for future context.

This information will be extracted and included in future agent steps to maintain context across interactions. Use this for critical facts, observations, or user preferences that should influence future decisions.

**Arguments**:

- `information` _str_ - The information to remember

**Returns**:

- `str` - Confirmation message

**Usage:**

```python
# Remember user preferences
tools.remember("User prefers dark mode")

# Remember important state
tools.remember("Flight booking confirmation code: ABC123")

# Remember task progress
tools.remember("Already sent email to john@example.com")
```

**Notes:**
- Memory is limited to 10 most recent items
- Memory persists for the duration of the agent's execution
- Memory is accessible via `get_memory()` or automatically included in agent context

<a id="droidrun.tools.adb.AdbTools.get_memory"></a>

#### AdbTools.get\_memory

```python
def get_memory() -> List[str]
```

Retrieve all stored memory items.

**Returns**:

- `List[str]` - List of stored memory items

**Usage:**

```python
memory = tools.get_memory()
for item in memory:
    print(f"- {item}")
```

<a id="droidrun.tools.adb.AdbTools.complete"></a>

#### AdbTools.complete

```python
def complete(success: bool, reason: str = "")
```

Mark the task as finished.

**Arguments**:

- `success` _bool_ - Indicates if the task was successful
- `reason` _str_ - Reason for failure/success (optional for success, required if success=False)

**Usage:**

```python
# Success
tools.complete(success=True, reason="Successfully sent message to John")

# Failure
tools.complete(success=False, reason="Could not find contact 'John' in contacts app")
```

**Notes:**
- This sets internal flags (`finished`, `success`, `reason`) used by agents to determine completion
- If `success=False`, `reason` is required (raises ValueError if not provided)
- If `success=True` and no reason provided, defaults to "Task completed successfully."
- Uses `@Tools.ui_action` decorator for automatic screenshot capture
- This does not terminate execution, it only sets completion flags

---

## Properties

**Instance variables:**

- `device` - ADB device instance (from adbutils)
- `portal` - PortalClient instance for device communication (TCP or content provider mode)
- `clickable_elements_cache` - List of cached UI elements from last `get_state()` call
- `memory` - List of remembered information items (max 10)
- `screenshots` - List of captured screenshots with timestamps (format: `[{"timestamp": float, "image_data": bytes, "format": "PNG"}]`)
- `save_trajectories` - Trajectory saving level: "none", "step", or "action"
- `finished` - Boolean indicating if task is complete (set by `complete()`)
- `success` - Boolean indicating if task succeeded (set by `complete()`)
- `reason` - String describing success/failure reason (set by `complete()`)
- `app_opener_llm` - LLM instance for app opening workflow (optional)
- `text_manipulator_llm` - LLM instance for text manipulation (optional)
- `credential_manager` - CredentialManager instance for secret handling (optional)

---

## Notes

- **Portal app required**: The Droidrun Portal app must be installed and accessibility service enabled on the device
- **TCP vs Content Provider**: TCP is faster but requires port forwarding (`adb forward tcp:8080 tcp:8080`). Content provider is the fallback mode using ADB shell commands.
- **Element caching**: Always call `get_state()` before using `tap_by_index()` or `tap()` to populate the element cache
- **Trajectory recording**: When `save_trajectories="action"`, screenshots and UI states are automatically captured for each UI action via the `@Tools.ui_action` decorator
- **Unicode support**: `input_text()` supports Unicode characters and special characters via the Portal app's custom keyboard
- **Event streaming**: When a context is set via `_set_context()`, action events (TapActionEvent, SwipeActionEvent, etc.) are emitted for trajectory tracking
- **Decorator behavior**: Methods decorated with `@Tools.ui_action` automatically capture screenshots and emit events when trajectory recording is enabled

---

## Example Workflow

```python
from droidrun.tools import AdbTools

# Initialize tools (auto-detects device if serial not provided)
tools = AdbTools(serial="emulator-5554", use_tcp=True)

# Check Portal connection
ping_result = tools.ping()
print(f"Portal status: {ping_result}")

# Start Chrome app (auto-detects main activity)
result = tools.start_app("com.android.chrome")
print(result)

# Get UI state (populates clickable_elements_cache)
state = tools.get_state()
print(f"Current activity: {state['phone_state']['current_activity']}")
print(f"Keyboard shown: {state['phone_state']['keyboard_shown']}")

# Find and tap search bar by iterating through elements
for element in state['a11y_tree']:
    element_text = element.get('text', '').lower()
    if 'search' in element_text or 'address' in element_text:
        result = tools.tap_by_index(element['index'])
        print(result)
        break

# Input search query
result = tools.input_text("Droidrun framework")
print(result)

# Press enter key
result = tools.press_key(66)
print(result)

# Take screenshot
format, screenshot = tools.take_screenshot()
print(f"Screenshot format: {format}, size: {len(screenshot)} bytes")
with open("search_result.png", "wb") as f:
    f.write(screenshot)

# Remember result for future context
tools.remember("Searched for Droidrun framework in Chrome")

# Complete task
tools.complete(success=True, reason="Successfully searched for Droidrun in Chrome")

# Check completion status
print(f"Task finished: {tools.finished}")
print(f"Task success: {tools.success}")
print(f"Reason: {tools.reason}")
```
