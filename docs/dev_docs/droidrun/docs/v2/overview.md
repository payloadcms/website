---
title: 'Introduction'
description: 'Welcome to DroidRun - Control Android devices with LLM agents'
---

# Welcome to DroidRun

DroidRun is a powerful framework that enables you to control Android devices through LLM agents. It provides a simple and intuitive way to automate Android device interactions using natural language commands.

## Features

<CardGroup cols={2}>
  <Card title="Natural Language Control" icon="wand-magic-sparkles">
    Control your Android device using natural language commands
  </Card>
  <Card title="Multiple LLM Support" icon="brain">
    Support for OpenAI, Anthropic, Gemini, Ollama, and Deepseek
  </Card>
  <Card title="Advanced Planning" icon="diagram-project">
    Optional planning and reasoning capabilities
  </Card>
  <Card title="Vision Support" icon="eye">
    Built-in vision capabilities for screen analysis
  </Card>
  <Card title="Simple CLI" icon="terminal">
    Rich terminal UI with live updates
  </Card>
  <Card title="Python SDK" icon="code">
    Comprehensive SDK for custom automation tasks
  </Card>
</CardGroup>

## Quick Example

```bash
# Simple CLI usage
droidrun "Open the settings app"

# With specific provider and model
droidrun "Open calculator app" --provider Gemini --model models/gemini-2.5-pro

# With vision and planning capabilities
droidrun "Open Calculator and take a screenshot" --vision --reasoning
```

Or with Python:

```python
import asyncio
from droidrun.agent.droid import DroidAgent
from droidrun.agent.utils.llm_picker import load_llm
from droidrun.tools import load_tools

async def main():
    # Load tools and LLM
    tool_list, tools_instance = await load_tools()
    llm = load_llm(
        provider_name="Gemini",  # OpenAI, ollama, Anthropic, Gemini, DeepSeek
        model="models/gemini-2.5-pro",
        temperature=0.2
    )
    
    # Create and run the agent
    agent = DroidAgent(
        goal="Open the Settings app",
        llm=llm,
        tools_instance=tools_instance,
        tool_list=tool_list,
        vision=True,      # Enable vision capabilities
        reasoning=True,   # Enable planning mode
        enable_tracing=True  # Enable execution tracing
    )
    
    result = await agent.run()
    print(f"Success: {result['success']}")
    if result.get('output'):
        print(f"Output: {result['output']}")

if __name__ == "__main__":
    asyncio.run(main())
```

## Prerequisites

- Android device connected via USB or ADB over TCP/IP
- ADB (Android Debug Bridge) installed
- API key for at least one LLM provider
- DroidRun Portal app installed and accessibility service enabled

## Getting Started

<CardGroup cols={3}>
  <Card title="Quickstart" icon="rocket" href="/v2/quickstart">
    Get up and running with DroidRun in minutes
  </Card>
</CardGroup>

## Core Concepts

<CardGroup cols={2}>
  <Card title="Agent" icon="robot" href="/v2/concepts/agent">
    Learn about the DroidAgent system
  </Card>
  <Card title="Android Control" icon="mobile" href="/v2/concepts/android-control">
    Explore Android device interactions
  </Card>
  <Card title="Planning" icon="diagram-project" href="/v2/concepts/planning">
    Understanding planning and reasoning
  </Card>
  <Card title="Portal App" icon="door-open" href="/v2/concepts/portal-app">
    DroidRun Portal accessibility service
  </Card>
  <Card title="Tracing" icon="bug" href="/v2/concepts/tracing">
    Debug and analyze execution with Phoenix
  </Card>
</CardGroup> 