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
    Support for OpenAI, Anthropic, and Google Gemini
  </Card>
  <Card title="Simple CLI" icon="terminal">
    Easy-to-use command line interface
  </Card>
  <Card title="Python SDK" icon="code">
    Comprehensive SDK for custom automation tasks
  </Card>
</CardGroup>

## Quick Example

```bash
# Simple CLI usage
droidrun "Open the settings app"

# With specific provider
droidrun "Open calculator app" --provider gemini --model gemini-2.0-flash

# With vision capabilities
droidrun "Open Calculator and take a screenshot" --vision
```

Or with Python:

```python
import asyncio
import os
from droidrun.agent.react_agent import ReActAgent
from droidrun.agent.llm_reasoning import LLMReasoner

async def main():
    # Create an LLM instance
    llm = LLMReasoner(
        llm_provider="gemini",  # "openai", "anthropic", or "gemini"
        model_name="gemini-2.0-flash",
        api_key=os.environ.get("GEMINI_API_KEY"),
        temperature=0.2,
        vision=True  # Enable vision capabilities
    )
    
    # Create and run the agent
    agent = ReActAgent(
        task="Open the Settings app",
        llm=llm,
        vision=True  # Enable screenshot analysis
    )
    
    steps = await agent.run()
    
    # Get token usage statistics
    stats = llm.get_token_usage_stats()
    print(f"Total tokens used: {stats['total_tokens']}")

if __name__ == "__main__":
    asyncio.run(main())
```

## Prerequisites

- Android device connected via USB or ADB over TCP/IP
- ADB (Android Debug Bridge) installed
- API key for at least one LLM provider (OpenAI, Anthropic, or Google Gemini)

## Getting Started

<CardGroup cols={3}>
  <Card title="Quickstart" icon="rocket" href="/v1/quickstart">
    Get up and running with DroidRun in minutes
  </Card>
</CardGroup>

## Core Concepts

<CardGroup cols={2}>
  <Card title="Agent" icon="robot" href="/v1/concepts/agent">
    Learn about the ReAct agent system
  </Card>
  <Card title="Android Control" icon="mobile" href="/v1/concepts/android-control">
    Explore Android device interactions
  </Card>
</CardGroup> 