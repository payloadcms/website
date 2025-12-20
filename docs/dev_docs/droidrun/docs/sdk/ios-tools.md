---
title: IOSTools
---

# IOSTools API Reference

<a id="droidrun.tools.ios.IOSTools"></a>

## IOSTools

```python
class IOSTools(Tools)
```

Core UI interaction tools for iOS device control via the Droidrun iOS Portal app.

**Status**: iOS support is in beta with limited functionality compared to AdbTools.

**Key Limitations**:
- ⚠️ `get_date()` - Not implemented
- ⚠️ `get_apps()` - Not implemented
- ⚠️ `drag()` - Not implemented
- ⚠️ `back()` - Not implemented (iOS has no universal back button)
- ⚠️ `input_text()` - Does not support `index` or `clear` parameters
- ⚠️ `_extract_element_coordinates_by_index()` - Not implemented

<a id="droidrun.tools.ios.IOSTools.__init__"></a>

#### IOSTools.\_\_init\_\_

```python
def __init__(
    url: str,
    bundle_identifiers: List[str] | None = None
) -> None
```

Initialize the IOSTools instance.

**Arguments**:

- `url` _str_ - iOS Portal app URL (e.g., "http://192.168.1.100:8080")
- `bundle_identifiers` _List[str] | None_ - Optional list of custom app bundle identifiers

**Usage:**

```python
from droidrun.tools import IOSTools

# Connect to iOS device
tools = IOSTools(url="http://192.168.1.100:8080")

# With specific bundle identifiers
tools = IOSTools(
    url="http://192.168.1.100:8080",
    bundle_identifiers=["com.example.app1", "com.example.app2"]
)
```

**Setup Requirements:**

1. Install Droidrun iOS Portal app on device
2. Launch Portal app (starts HTTP server)
3. Connect device and computer to same network
4. Use displayed URL to initialize IOSTools

---

## UI Interaction Methods

<a id="droidrun.tools.ios.IOSTools.tap_by_index"></a>

#### IOSTools.tap\_by\_index

```python
def tap_by_index(index: int) -> str
```

Tap a UI element by its index from the accessibility tree.

**Arguments**:

- `index` _int_ - Element index from accessibility tree

**Returns**:

- `str` - Result message with tapped element details

**Usage:**

```python
state = tools.get_state()
result = tools.tap_by_index(3)
# Returns: "Tapped element with index 3 | Text: 'Continue' | Class: Button | Rect: {{100,200},{200,50}}"
```

**Notes:**
- Must call `get_state()` first to populate element cache
- Returns error with available indices if index is invalid
- Waits 0.5s after tap for UI to update

<a id="droidrun.tools.ios.IOSTools.tap"></a>

#### IOSTools.tap

```python
def tap(index: int) -> str
```

Alias for `tap_by_index()`.

**Arguments**:

- `index` _int_ - Element index

**Returns**:

- `str` - Result message

<a id="droidrun.tools.ios.IOSTools.swipe"></a>

#### IOSTools.swipe

```python
def swipe(
    start_x: int,
    start_y: int,
    end_x: int,
    end_y: int,
    duration_ms: int = 300
) -> bool
```

Perform directional swipe gesture (up, down, left, right).

**Arguments**:

- `start_x` _int_ - Starting X coordinate
- `start_y` _int_ - Starting Y coordinate
- `end_x` _int_ - Ending X coordinate
- `end_y` _int_ - Ending Y coordinate
- `duration_ms` _int_ - Duration in milliseconds (ignored on iOS)

**Returns**:

- `bool` - True if successful, False otherwise

**Usage:**

```python
# Swipe up (scroll down)
tools.swipe(200, 800, 200, 200)

# Swipe left
tools.swipe(600, 400, 100, 400)
```

**Notes:**
- iOS uses directional swipes, not precise coordinates
- Direction calculated from coordinate delta (largest axis wins)
- `duration_ms` parameter ignored by iOS API

<a id="droidrun.tools.ios.IOSTools.drag"></a>

#### IOSTools.drag

```python
def drag(
    start_x: int,
    start_y: int,
    end_x: int,
    end_y: int,
    duration_ms: int = 3000
) -> bool
```

⚠️ **NOT IMPLEMENTED** - Always returns False.

Drag gestures are not supported on iOS.

**Arguments**:

- `start_x` _int_ - Starting X coordinate (unused)
- `start_y` _int_ - Starting Y coordinate (unused)
- `end_x` _int_ - Ending X coordinate (unused)
- `end_y` _int_ - Ending Y coordinate (unused)
- `duration_ms` _int_ - Duration in milliseconds (unused)

**Returns**:

- `bool` - Always False

<a id="droidrun.tools.ios.IOSTools.input_text"></a>

#### IOSTools.input\_text

```python
def input_text(text: str) -> str
```

Input text into the currently focused element.

⚠️ **Signature differs from base class** - Does not support `index` or `clear` parameters.

**Arguments**:

- `text` _str_ - Text to input (supports Unicode and newlines)

**Returns**:

- `str` - Result message

**Usage:**

```python
# Tap text field first
tools.tap_by_index(5)

# Input text
tools.input_text("Hello World")

# Unicode supported
tools.input_text("你好世界")
```

**Notes:**
- Must tap text field before calling this method
- Uses last tapped element's rect for targeting
- Waits 0.5s after input
- No `index` or `clear` parameters (unlike AdbTools)

<a id="droidrun.tools.ios.IOSTools.back"></a>

#### IOSTools.back

```python
def back() -> str
```

⚠️ **NOT IMPLEMENTED** - Raises `NotImplementedError`.

iOS has no universal back button. Use navigation UI elements instead.

**Raises**:

- `NotImplementedError` - Always raised when called

<a id="droidrun.tools.ios.IOSTools.press_key"></a>

#### IOSTools.press\_key

```python
def press_key(keycode: int) -> str
```

Press a hardware key.

**Supported keycodes:**
- `0` - HOME button
- `4` - ACTION button
- `5` - CAMERA button

**Arguments**:

- `keycode` _int_ - iOS keycode

**Returns**:

- `str` - Result message

**Usage:**

```python
tools.press_key(0)  # Home button
tools.press_key(4)  # Action button
```

**Notes:**
- Limited to hardware keys only
- Most navigation uses gestures or UI elements

---

## App Management Methods

<a id="droidrun.tools.ios.IOSTools.start_app"></a>

#### IOSTools.start\_app

```python
def start_app(package: str, activity: str = "") -> str
```

Launch an app by bundle identifier.

**Arguments**:

- `package` _str_ - Bundle identifier (e.g., "com.apple.MobileSMS")
- `activity` _str_ - Ignored on iOS (for API compatibility)

**Returns**:

- `str` - Result message

**Common bundle identifiers:**
- Messages: `com.apple.MobileSMS`
- Safari: `com.apple.mobilesafari`
- Settings: `com.apple.Preferences`
- Mail: `com.apple.mobilemail`
- Calendar: `com.apple.mobilecal`
- Photos: `com.apple.mobileslideshow`
- Maps: `com.apple.Maps`
- Contacts: `com.apple.MobileAddressBook`

**Usage:**

```python
tools.start_app("com.apple.MobileSMS")
tools.start_app("com.apple.mobilesafari")
```

**Notes:**
- Waits 1s after launch
- `activity` parameter ignored

<a id="droidrun.tools.ios.IOSTools.list_packages"></a>

#### IOSTools.list\_packages

```python
def list_packages(include_system_apps: bool = True) -> List[str]
```

List known bundle identifiers.

**Arguments**:

- `include_system_apps` _bool_ - Include system apps (default: True)

**Returns**:

- `List[str]` - List of bundle identifiers

**Usage:**

```python
packages = tools.list_packages()
custom_only = tools.list_packages(include_system_apps=False)
```

**Notes:**
- Returns union of `bundle_identifiers` + system apps
- System apps: Settings, Safari, Messages, Mail, etc.
- Does not query device for installed apps

---

## State and Screenshot Methods

<a id="droidrun.tools.ios.IOSTools.get_state"></a>

#### IOSTools.get\_state

```python
def get_state() -> Dict[str, Any]
```

Get accessibility tree and device state.

**Returns**:

Dictionary with:
- `a11y_tree` - List of interactive UI elements
- `phone_state` - Current activity and keyboard visibility

**Element structure:**

```python
{
    "index": 3,
    "type": "Button",
    "className": "Button",
    "text": "Continue",
    "label": "Continue",
    "identifier": "continueButton",
    "placeholder": "",
    "value": "",
    "bounds": "100,200,300,250",  # left,top,right,bottom
    "rect": "100,200,200,50",      # x,y,width,height (iOS format)
    "x": 100,
    "y": 200,
    "width": 200,
    "height": 50,
    "center_x": 200,
    "center_y": 225
}
```

**Interactive element types:**
- Button, SearchField, TextField, Cell
- Switch, Slider, Stepper, Picker, Link

**Usage:**

```python
state = tools.get_state()

for elem in state['a11y_tree']:
    print(f"[{elem['index']}] {elem['text']} ({elem['className']})")

activity = state['phone_state']['current_activity']
keyboard = state['phone_state']['keyboard_shown']
```

**Notes:**
- Only interactive elements included
- Non-interactive elements filtered out
- More detailed than Android accessibility tree

<a id="droidrun.tools.ios.IOSTools.take_screenshot"></a>

#### IOSTools.take\_screenshot

```python
def take_screenshot() -> Tuple[str, bytes]
```

Capture device screen as PNG.

**Returns**:

- `Tuple[str, bytes]` - ("PNG", image_bytes)

**Usage:**

```python
format, img_data = tools.take_screenshot()

with open("screenshot.png", "wb") as f:
    f.write(img_data)
```

**Notes:**
- Stores screenshot with timestamp internally
- Used for trajectory recording

---

## Memory and Completion Methods

<a id="droidrun.tools.ios.IOSTools.remember"></a>

#### IOSTools.remember

```python
def remember(information: str) -> str
```

Store information for future context.

**Arguments**:

- `information` _str_ - Information to remember

**Returns**:

- `str` - Confirmation message

**Usage:**

```python
tools.remember("User prefers light mode")
tools.remember("Calendar event created for 3pm")
tools.remember("Already logged into email")
```

**Notes:**
- Max 10 most recent items
- Persists during agent execution only

<a id="droidrun.tools.ios.IOSTools.get_memory"></a>

#### IOSTools.get\_memory

```python
def get_memory() -> List[str]
```

Get all stored memory items.

**Returns**:

- `List[str]` - Stored memory items

**Usage:**

```python
for item in tools.get_memory():
    print(f"- {item}")
```

<a id="droidrun.tools.ios.IOSTools.complete"></a>

#### IOSTools.complete

```python
def complete(success: bool, reason: str = "")
```

Mark task as finished.

**Arguments**:

- `success` _bool_ - Task success status
- `reason` _str_ - Required if `success=False`

**Usage:**

```python
tools.complete(True, "Successfully sent iMessage")
tools.complete(False, "Could not find contact 'John'")
```

---

## Missing Methods

The following abstract methods from `Tools` base class are **not implemented**:

#### get\_date()
⚠️ Not implemented. Returns "Not implemented for iOS" or raises error.

#### get\_apps()
⚠️ Not implemented. Use `list_packages()` instead (returns bundle identifiers only).

#### \_extract\_element\_coordinates\_by\_index()
⚠️ Not implemented. Use `tap_by_index()` directly instead.

---

## Instance Properties

```python
tools.url                       # iOS Portal URL
tools.clickable_elements_cache  # Cached elements from get_state()
tools.memory                    # List of remembered items
tools.screenshots               # List of {timestamp, data} dicts
tools.last_tapped_rect          # Last tapped element rect (for input_text)
tools.bundle_identifiers        # Custom bundle IDs
tools.finished                  # Task completion flag
tools.success                   # Task success flag
tools.reason                    # Completion reason string
```

---

## iOS vs Android Differences

| Feature | iOS | Android |
|---------|-----|---------|
| Back button | ❌ Not available | ✅ Available |
| Swipe | Direction-based | Coordinate-based |
| Drag | ❌ Not implemented | ✅ Implemented |
| App IDs | Bundle identifiers | Package names |
| Key codes | 3 keys (HOME, ACTION, CAMERA) | Full Android keycodes |
| Accessibility | Richer element data | Basic element data |
| Connection | HTTP (Portal app) | ADB over USB/TCP |
| get_date() | ❌ Not implemented | ✅ Implemented |
| input_text() | No index/clear params | Full signature |

**Setup differences:**

**Android**: USB or `adb connect` + Portal APK
**iOS**: Portal app + same network + HTTP connection

**Limitations:**
- HTTP only (no USB like Android)
- Direction-based gestures (not coordinate-precise)
- Fewer system controls

---

## Example Usage

```python
from droidrun.tools import IOSTools

# Initialize
tools = IOSTools(url="http://192.168.1.100:8080")

# Launch app
tools.start_app("com.apple.MobileSMS")

# Get state and find compose button
state = tools.get_state()
for elem in state['a11y_tree']:
    if 'compose' in elem['label'].lower():
        tools.tap_by_index(elem['index'])
        break

# Input recipient
state = tools.get_state()
for elem in state['a11y_tree']:
    if elem['type'] == 'TextField' and 'to' in elem['label'].lower():
        tools.tap_by_index(elem['index'])
        break
tools.input_text("John")

# Input message
state = tools.get_state()
for elem in state['a11y_tree']:
    if elem['type'] == 'TextField' and 'message' in elem['label'].lower():
        tools.tap_by_index(elem['index'])
        break
tools.input_text("Hello from Droidrun!")

# Send
state = tools.get_state()
for elem in state['a11y_tree']:
    if 'send' in elem['label'].lower():
        tools.tap_by_index(elem['index'])
        break

# Complete
tools.remember("Sent message to John via iMessage")
tools.complete(True, "Successfully sent iMessage")
```

---

## See Also

- [AdbTools](/v4/sdk/adb-tools) - Android device control with full functionality
- [Tools Base Class](/v4/sdk/base-tools) - Abstract base class reference
