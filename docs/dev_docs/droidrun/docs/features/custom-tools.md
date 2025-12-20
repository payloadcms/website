---
title: '커스텀 도구'
description: '커스텀 Python 함수로 Droidrun 확장'
---

## 개요

커스텀 도구는 내장된 원자적 행동(click, type, swipe)을 넘어 에이전트의 기능을 확장하는 Python 함수입니다.

**사용 사례:**
- 외부 API 호출 (웹훅, REST 서비스)
- 데이터 처리 및 계산
- 데이터베이스 작업
- 도메인별 로직

---

## Quick Start

### Basic Example

Simple custom tool without device access:

```python
import asyncio
from droidrun import DroidAgent, DroidrunConfig

def calculate_tax(amount: float, rate: float, **kwargs) -> str:
    """Calculate tax for a given amount."""
    tax = amount * rate
    total = amount + tax
    return f"Tax: ${tax:.2f}, Total: ${total:.2f}"

custom_tools = {
    "calculate_tax": {
        "arguments": ["amount", "rate"],
        "description": "Calculate tax for a given amount and rate",
        "function": calculate_tax
    }
}

async def main():
    config = DroidrunConfig()

    agent = DroidAgent(
        goal="Calculate tax for $100 at 8% rate",
        config=config,
        custom_tools=custom_tools
    )

    result = await agent.run()
    print(result.success, result.reason)

asyncio.run(main())
```

---

## Tool Structure

All custom tools follow this format:

```python
custom_tools = {
    "tool_name": {
        "arguments": ["arg1", "arg2"],           # Parameter names
        "description": "Tool description...",    # For LLM prompt
        "function": callable_function            # Python function
    }
}
```

**Function signature:**
```python
def tool_name(arg1: type, arg2: type, *, tools=None, shared_state=None, **kwargs) -> str:
    """
    Args:
        arg1: Your parameter
        arg2: Another parameter
        tools: Tools instance (optional, injected automatically)
        shared_state: DroidAgentState (optional, injected automatically)
    """
    # Implementation
    return "result"
```

**Key points:**
- List only user arguments in `"arguments"` (not `tools` or `shared_state`)
- `tools` and `shared_state` are injected automatically as keyword arguments
- Use `**kwargs` for forward compatibility
- Return type should be `str`

---

## Using Tools Instance

Access device via the `tools` parameter:

```python
def screenshot_and_count(*, tools=None, shared_state=None, **kwargs) -> str:
    """Take screenshot and count UI elements."""
    if not tools:
        return "Error: tools instance required"

    # Take screenshot
    screenshot_path, screenshot_bytes = tools.take_screenshot()

    # Get UI state
    state = tools.get_state()
    element_count = len(state.get("ui_elements", []))

    return f"Screenshot saved. Found {element_count} UI elements"

custom_tools = {
    "screenshot_and_count": {
        "arguments": [],
        "description": "Take screenshot and count UI elements on screen",
        "function": screenshot_and_count
    }
}
```

**Available via `tools`:**
- `tools.take_screenshot()` - Capture screen
- `tools.get_state()` - Get UI hierarchy
- `tools.tap_by_index(index)` - Tap element
- `tools.input_text(text, index)` - Type text
- `tools.swipe(x1, y1, x2, y2)` - Swipe gesture
- All methods from AdbTools/IOSTools

---

## Using Shared State

Access agent state via `shared_state`:

```python
def check_action_history(action_name: str, *, tools=None, shared_state=None, **kwargs) -> str:
    """Check if action was recently performed."""
    if not shared_state:
        return "Error: shared_state required"

    # Check recent actions
    recent_actions = shared_state.action_history[-5:]
    already_done = any(a.get("action") == action_name for a in recent_actions)

    if already_done:
        return f"Action '{action_name}' was already performed recently"

    # Check step count
    if shared_state.step_number > 10:
        return "Warning: Task taking too many steps"

    # Access memory
    if "skip_validation" in shared_state.memory:
        return "Validation skipped per memory"

    return f"Action '{action_name}' not yet performed"

custom_tools = {
    "check_action_history": {
        "arguments": ["action_name"],
        "description": "Check if a specific action was recently performed in agent history",
        "function": check_action_history
    }
}
```

**DroidAgentState fields:**
- `step_number` - Current execution step
- `action_history` - List of executed actions
- `action_outcomes` - Success/failure per action
- `memory` - Agent memory dict
- `custom_variables` - User-provided variables
- `visited_packages` - Apps visited
- `current_package_name` - Current app package
- `plan` - Current Manager plan
- More in `droidrun/agent/droid/events.py`

---

## Common Patterns

### API Integration

```python
import requests

def fetch_weather(city: str, **kwargs) -> str:
    """Fetch weather data from API."""
    try:
        # Using OpenWeatherMap API example
        api_key = "your_api_key"
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}"

        response = requests.get(url, timeout=10)
        response.raise_for_status()

        data = response.json()
        temp = data["main"]["temp"] - 273.15  # Convert to Celsius
        weather = data["weather"][0]["description"]

        return f"Weather in {city}: {weather}, {temp:.1f}°C"
    except Exception as e:
        return f"Error: {str(e)}"

custom_tools = {
    "fetch_weather": {
        "arguments": ["city"],
        "description": "Fetch current weather data for a given city",
        "function": fetch_weather
    }
}
```

### Database Query

```python
import sqlite3

def query_database(query: str, **kwargs) -> str:
    """Query local database."""
    try:
        conn = sqlite3.connect("app.db")
        cursor = conn.execute(query)
        results = cursor.fetchall()
        conn.close()

        return f"Found {len(results)} results"
    except Exception as e:
        return f"Database error: {str(e)}"

custom_tools = {
    "query_database": {
        "arguments": ["query"],
        "description": "Execute SQL query on local database and return results",
        "function": query_database
    }
}
```

### Async Operations

```python
import aiohttp

async def fetch_async(url: str, **kwargs) -> str:
    """Fetch data asynchronously."""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=10) as response:
                data = await response.text()
                return f"Fetched {len(data)} bytes from {url}"
    except Exception as e:
        return f"Error: {str(e)}"

custom_tools = {
    "fetch_async": {
        "arguments": ["url"],
        "description": "Asynchronously fetch data from a URL",
        "function": fetch_async
    }
}
```

---

## Best Practices

### 1. Clear Descriptions
Write descriptive, specific descriptions:

```python
# Good
"description": "Send POST request to webhook URL with JSON data payload"

# Bad
"description": "Send webhook"
```

### 2. Error Handling
Always catch exceptions:

```python
def robust_tool(url: str, **kwargs) -> str:
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return f"Success: {response.status_code}"
    except requests.Timeout:
        return "Error: Request timed out"
    except requests.RequestException as e:
        return f"Error: {str(e)}"
    except Exception as e:
        return f"Unexpected error: {str(e)}"
```

### 3. Argument Validation
Validate inputs before processing:

```python
def validated_tool(count: int, **kwargs) -> str:
    if not isinstance(count, int):
        return "Error: count must be integer"
    if count < 0 or count > 100:
        return "Error: count must be 0-100"

    return f"Processed {count} items"
```

### 4. Logging
Use Python logging for debugging:

```python
import logging
logger = logging.getLogger("droidrun")

def logged_tool(data: str, **kwargs) -> str:
    logger.info(f"Processing: {data[:50]}...")
    # Process data
    logger.info("Complete")
    return "Success"
```

---

## Advanced Example

Combining tools instance, shared state, and credentials:

```python
import requests

def send_authenticated_request(
    url: str,
    data: str,
    *,
    tools=None,
    shared_state=None,
    **kwargs
) -> str:
    """Send authenticated API request with credential."""
    try:
        # Access credentials via tools instance
        if not tools or not hasattr(tools, 'credential_manager'):
            return "Error: Credential manager not available"

        api_key = tools.credential_manager.resolve_key("API_KEY")

        # Check if we've made too many requests
        if shared_state and shared_state.step_number > 15:
            return "Error: Too many API calls"

        # Send authenticated request
        headers = {"Authorization": f"Bearer {api_key}"}
        response = requests.post(url, json={"data": data}, headers=headers, timeout=10)
        response.raise_for_status()

        return f"Request successful: {response.status_code}"
    except Exception as e:
        return f"Error: {str(e)}"

custom_tools = {
    "send_authenticated_request": {
        "arguments": ["url", "data"],
        "description": "Send authenticated API request using stored credentials",
        "function": send_authenticated_request
    }
}

# Usage with credentials
credentials = {"API_KEY": "sk-1234567890"}

agent = DroidAgent(
    goal="Send data to API",
    config=config,
    custom_tools=custom_tools,
    credentials=credentials
)
```

---

## Related

See [Agent Architecture](/concepts/architecture) for understanding shared state and custom tools integration.