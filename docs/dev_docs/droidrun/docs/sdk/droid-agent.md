---
title: DroidAgent
---

DroidAgent - A wrapper class that coordinates the planning and execution of tasks to achieve a user's goal on an Android or iOS device.

<a id="droidrun.agent.droid.droid_agent.DroidAgent"></a>

## DroidAgent

```python
class DroidAgent(Workflow)
```

A wrapper class that coordinates between agents to achieve a user's goal.

**Architecture:**
- When `reasoning=False`: Uses CodeActAgent directly for immediate execution
- When `reasoning=True`: Uses ManagerAgent (planning) + ExecutorAgent (actions) + ScripterAgent (off-device operations)

<a id="droidrun.agent.droid.droid_agent.DroidAgent.__init__"></a>

#### DroidAgent.\_\_init\_\_

```python
def __init__(
    goal: str,
    config: DroidrunConfig | None = None,
    llms: dict[str, LLM] | LLM | None = None,
    tools: "Tools | None" = None,
    custom_tools: dict | None = None,
    credentials: dict | None = None,
    variables: dict | None = None,
    output_model: Type[BaseModel] | None = None,
    prompts: dict[str, str] | None = None,
    timeout: int = 1000
)
```

Initialize the DroidAgent wrapper.

**Arguments**:

- `goal` _str_ - User's goal or command to execute
- `config` _DroidrunConfig | None_ - Full configuration object (required if llms not provided). Contains agent settings, LLM profiles, device config, and more.
- `llms` _dict[str, LLM] | LLM | None_ - Optional LLM configuration:
  - `dict[str, LLM]`: Agent-specific LLMs with keys: "manager", "executor", "codeact", "text_manipulator", "app_opener", "scripter", "structured_output"
  - `LLM`: Single LLM instance used for all agents
  - `None`: LLMs will be loaded from config.llm_profiles
- `tools` _Tools | None_ - Pre-configured Tools instance (AdbTools or IOSTools). If None, tools will be created from config.
- `custom_tools` _dict | None_ - Custom tool definitions. Format: `{"tool_name": {"signature": "...", "description": "...", "function": callable}}`. These are merged with auto-generated credential tools.
- `credentials` _dict | None_ - Direct credential mapping `{"SECRET_ID": "value"}`. If None, credentials will be loaded from config.credentials if available.
- `variables` _dict | None_ - Custom variables accessible throughout execution. Available in shared_state.custom_variables.
- `output_model` _Type[BaseModel] | None_ - Pydantic model for structured output extraction from final answer. If provided, the final answer will be parsed into this model.
- `prompts` _dict[str, str] | None_ - Custom Jinja2 prompt templates to override defaults. Keys: "codeact_system", "codeact_user", "manager_system", "executor_system", "scripter_system". Values: Jinja2 template strings (NOT file paths).
- `timeout` _int_ - Workflow timeout in seconds (default: 1000)

**Basic initialization pattern (recommended):**

```python
from droidrun import DroidAgent
from droidrun.config_manager import DroidrunConfig

# Initialize with default config
config = DroidrunConfig()

# Create agent (LLMs loaded from config.llm_profiles)
agent = DroidAgent(
    goal="Open Chrome and search for Droidrun",
    config=config
)

# Run agent
result = await agent.run()
```

**Loading from YAML (optional):**

```python
from droidrun import DroidAgent
from droidrun.config_manager import DroidrunConfig

# Load config from config.yaml
config = DroidrunConfig.from_yaml("config.yaml")

# Create agent (LLMs loaded from config.llm_profiles)
agent = DroidAgent(
    goal="Open Chrome and search for Droidrun",
    config=config
)

# Run agent
result = await agent.run()
```

**Custom LLM dictionary pattern:**

```python
from droidrun import DroidAgent
from droidrun.config_manager import DroidrunConfig
from llama_index.llms.openai import OpenAI
from llama_index.llms.anthropic import Anthropic

# Initialize config
config = DroidrunConfig()

# Create custom LLMs
llms = {
    "manager": Anthropic(model="claude-sonnet-4-5-latest", temperature=0.2),
    "executor": Anthropic(model="claude-sonnet-4-5-latest", temperature=0.1),
    "codeact": OpenAI(model="gpt-4o", temperature=0.2),
    "text_manipulator": OpenAI(model="gpt-4o-mini", temperature=0.3),
    "app_opener": OpenAI(model="gpt-4o-mini", temperature=0.0),
    "scripter": OpenAI(model="gpt-4o", temperature=0.1),
    "structured_output": OpenAI(model="gpt-4o-mini", temperature=0.0),
}

# Create agent with custom LLMs
agent = DroidAgent(
    goal="Send a message to John",
    llms=llms,
    config=config
)

result = await agent.run()
```

**Single LLM pattern:**

```python
from droidrun import DroidAgent
from droidrun.config_manager import DroidrunConfig
from llama_index.llms.openai import OpenAI

# Initialize config
config = DroidrunConfig()

# Use same LLM for all agents
llm = OpenAI(model="gpt-4o", temperature=0.2)

agent = DroidAgent(
    goal="Take a screenshot and save it",
    llms=llm,
    config=config
)

result = await agent.run()
```

**Custom tools and credentials:**

```python
from droidrun import DroidAgent
from droidrun.config_manager import DroidrunConfig

# Initialize config
config = DroidrunConfig()

# Define custom tool
def search_database(query: str) -> str:
    """Search the local database."""
    # Your implementation
    return f"Results for: {query}"

custom_tools = {
    "search_database": {
        "signature": "search_database(query: str) -> str",
        "description": "Search the local database for information",
        "function": search_database
    }
}

# Provide credentials directly
credentials = {
    "GMAIL_USERNAME": "user@gmail.com",
    "GMAIL_PASSWORD": "secret123"
}

agent = DroidAgent(
    goal="Search database and email results",
    config=config,
    custom_tools=custom_tools,
    credentials=credentials
)

result = await agent.run()
```

**Structured output extraction:**

```python
from droidrun import DroidAgent
from droidrun.config_manager import DroidrunConfig
from pydantic import BaseModel, Field

# Initialize config
config = DroidrunConfig()

# Define output schema
class WeatherInfo(BaseModel):
    """Weather information."""
    temperature: float = Field(description="Temperature in Celsius")
    condition: str = Field(description="Weather condition")
    humidity: int = Field(description="Humidity percentage")

agent = DroidAgent(
    goal="Open weather app and get current weather",
    config=config,
    output_model=WeatherInfo
)

result = await agent.run()

# Access structured output
if result.success and result.structured_output:
    weather = result.structured_output  # WeatherInfo object
    print(f"Temperature: {weather.temperature}°C")
    print(f"Condition: {weather.condition}")
```

<a id="droidrun.agent.droid.droid_agent.DroidAgent.run"></a>

#### DroidAgent.run

```python
async def run(*args, **kwargs) -> ResultEvent
```

Run the DroidAgent workflow.

**Returns**:

- `ResultEvent` - Result object with the following attributes:
  - `success` (bool): True if task completed successfully
  - `reason` (str): Success message or failure reason
  - `steps` (int): Number of steps executed
  - `structured_output` (Any): Parsed Pydantic model (if output_model provided, otherwise None)

**Usage:**

```python
from droidrun import DroidAgent
from droidrun.config_manager import DroidrunConfig

# Initialize config
config = DroidrunConfig()

# Create and run agent
agent = DroidAgent(goal="...", config=config)
result = await agent.run()

print(f"Success: {result.success}")
print(f"Reason: {result.reason}")
print(f"Steps: {result.steps}")
```

**Streaming events:**

```python
from droidrun import DroidAgent
from droidrun.config_manager import DroidrunConfig

# Initialize config
config = DroidrunConfig()

agent = DroidAgent(goal="...", config=config)

# Stream events as they occur
async for event in agent.run_event_stream():
    if isinstance(event, ManagerInputEvent):
        print("Manager is planning...")
    elif isinstance(event, ExecutorInputEvent):
        print("Executor is taking action...")
    elif isinstance(event, TapActionEvent):
        print(f"Tapping element at {event.x}, {event.y}")
    elif isinstance(event, ResultEvent):
        # Final result
        print(f"Success: {event.success}")
        print(f"Reason: {event.reason}")
```

## Event Types

DroidAgent emits various events during execution:

**Workflow Events:**
- `StartEvent` - Workflow started
- `ManagerInputEvent` - Manager planning phase started
- `ManagerContextEvent` - Manager received context for planning
- `ManagerResponseEvent` - Manager intermediate response
- `ManagerPlanEvent` - Manager created a plan
- `ManagerPlanDetailsEvent` - Manager plan details
- `ExecutorInputEvent` - Executor action phase started
- `ExecutorContextEvent` - Executor received context
- `ExecutorResponseEvent` - Executor intermediate response
- `ExecutorActionEvent` - Executor action details
- `ExecutorActionResultEvent` - Executor action result details
- `ExecutorResultEvent` - Executor completed an action
- `ScripterExecutorInputEvent` - ScripterAgent started
- `ScripterExecutorResultEvent` - ScripterAgent completed
- `CodeActExecuteEvent` - CodeActAgent started (direct mode)
- `CodeActResultEvent` - CodeActAgent completed
- `FinalizeEvent` - Workflow finalizing
- `StopEvent` - Workflow completed

**Action Events:**
- `TapActionEvent` - UI element tapped
- `SwipeActionEvent` - Swipe gesture performed
- `DragActionEvent` - Drag gesture performed
- `InputTextActionEvent` - Text input
- `KeyPressActionEvent` - Key press action
- `StartAppEvent` - App launched

**State Events:**
- `ScreenshotEvent` - Screenshot captured
- `RecordUIStateEvent` - UI state recorded
- `MacroEvent` - Macro action recorded

## Configuration

DroidAgent uses a hierarchical configuration system. See the [Configuration Guide](/sdk/configuration) for details.

**Key configuration options:**

```yaml
agent:
  max_steps: 15           # Maximum execution steps
  reasoning: false        # Enable Manager/Executor workflow

  codeact:
    vision: false         # Enable screenshot analysis
    safe_execution: false # Restrict code execution

  manager:
    vision: false         # Enable screenshot analysis

  executor:
    vision: false         # Enable screenshot analysis

device:
  serial: null            # Device serial (null = auto-detect)
  platform: android       # "android" or "ios"
  use_tcp: false          # TCP vs content provider

logging:
  debug: false            # Debug logging
  save_trajectory: none   # Trajectory saving: "none", "step", "action"

tracing:
  enabled: false          # Arize Phoenix tracing
```

## Advanced Usage

**Custom Tools instance:**

```python
from droidrun import DroidAgent, DeviceConfig
from droidrun.config_manager import DroidrunConfig

# Initialize config with device settings
device_config = DeviceConfig(serial="emulator-5554", use_tcp=True)
config = DroidrunConfig(device=device_config)

agent = DroidAgent(
    goal="Open settings",
    config=config,
)

result = await agent.run()
```

**Custom variables:**

```python
from droidrun import DroidAgent
from droidrun.config_manager import DroidrunConfig

# Initialize config
config = DroidrunConfig()

agent = DroidAgent(
    goal="Complete task using context",
    config=config,
    variables={
        "user_name": "Alice",
        "project_id": "12345",
        "api_endpoint": "https://api.example.com"
    }
)

result = await agent.run()
```

Variables are accessible in shared_state.custom_variables throughout execution and can be referenced in custom tools or scripts.

**Custom prompts:**

```python
from droidrun import DroidAgent
from droidrun.config_manager import DroidrunConfig

# Initialize config
config = DroidrunConfig()

# Override default prompts with custom Jinja2 templates
custom_prompts = {
    "codeact_system": "You are a specialized agent for {{ platform }} devices...",
    "manager_system": "You are a planning agent. Your goal: {{ instruction }}..."
}

agent = DroidAgent(
    goal="Complete specialized task",
    config=config,
    prompts=custom_prompts
)

result = await agent.run()
```

Available prompt keys: "codeact_system", "codeact_user", "manager_system", "executor_system", "scripter_system"

## Notes

- **Config requirement**: Either `config` or `llms` must be provided. If `llms` is not provided, `config` is required to load LLMs from profiles.
- **Vision mode**: Enabling vision (agent_config.*.vision = True) increases token usage as screenshots are sent to the LLM.
- **Reasoning mode**: `reasoning=True` uses Manager/Executor workflow for complex planning. `reasoning=False` uses CodeActAgent for direct execution.
- **Safe execution**: When enabled, restricts imports and builtins in CodeActAgent and ScripterAgent (see safe_execution config).
- **Timeout**: Default is 1000 seconds. Increase for long-running tasks.
- **Credentials**: Credentials are automatically injected as custom tools (e.g., `get_username()`, `get_password()`).
