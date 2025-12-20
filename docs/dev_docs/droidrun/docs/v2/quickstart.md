---
title: 'Quickstart'
description: 'Get up and running with DroidRun quickly and effectively'
---

This guide will help you get DroidRun installed and running quickly, controlling your Android device through natural language in minutes.

## 📋 Prerequisites

Before installing DroidRun, ensure you have:

1. **Python 3.10+** installed on your system
2. **ADB (Android Debug Bridge)** installed and configured
   - [Download Android SDK Platform Tools](https://developer.android.com/studio/releases/platform-tools)
   - Make sure `adb` is in your PATH
3. **Android device** with:
   - Developer options enabled
   - USB debugging enabled
   - Connected via USB or on the same network (for wireless debugging)
4. **DroidRun Portal app** installed on your Android device
   - Available from the [DroidRun Portal repository](https://github.com/droidrun/droidrun-portal)
   - Installation instructions are provided in the [Install DroidRun Portal App](#install-droidrun-portal-app) section below

## 🚀 Installation Methods

### Method 1: Install from PyPI (Recommended)

The simplest way to install DroidRun is using pip:

```bash
pip install droidrun
```

### Method 2: Install from Source

To install the latest development version:

```bash
# Clone the repository
git clone https://github.com/droidrun/droidrun.git
cd droidrun

# Create a virtual environment (highly recommended)
python -m venv .venv

# Activate the virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies and the package in development mode
pip install -e .
```

Using a virtual environment helps isolate DroidRun's dependencies from your global Python environment, preventing potential conflicts with other packages.

## 🔑 API Key Setup

DroidRun supports multiple LLM providers. Set up at least one:

### OpenAI

1. Sign up at [OpenAI](https://platform.openai.com/)
2. Create an API key
3. Set environment variable:
   ```bash
   export OPENAI_API_KEY="your_openai_api_key_here"
   ```

### Anthropic

1. Sign up at [Anthropic](https://console.anthropic.com/)
2. Get API key
3. Set environment variable:
   ```bash
   export ANTHROPIC_API_KEY="your_anthropic_api_key_here"
   ```

### Google Gemini (Default)

1. Sign up for [Google AI Studio](https://makersuite.google.com/)
2. Create API key
3. Set environment variable:
   ```bash
   export GEMINI_API_KEY="your_gemini_api_key_here"
   ```

### Ollama (Local)

1. [Install Ollama](https://ollama.ai/)
2. Pull desired models:
   ```bash
   ollama pull llama2
   ```
3. No API key needed

### Deepseek

1. Sign up at [Deepseek](https://platform.deepseek.ai/)
2. Get API key
3. Set environment variable:
   ```bash
   export DEEPSEEK_API_KEY="your_deepseek_api_key_here"
   ```

For convenience, create a `.env` file:

```bash
# .env file example
export OPENAI_API_KEY="your_openai_api_key_here"
export ANTHROPIC_API_KEY="your_anthropic_api_key_here"
export GEMINI_API_KEY="your_gemini_api_key_here"
export DEEPSEEK_API_KEY="your_deepseek_api_key_here"
```

Then load it:
```bash
source .env
```

## 📱 Device Configuration

### Verify ADB Installation

Ensure ADB is properly installed:

```bash
adb version
```

### Connect to Device

Connect your device via USB or Wi-Fi:

```bash
# List connected devices
droidrun devices

# Connect over TCP/IP
droidrun connect 192.168.1.100
```

Make sure:
- USB debugging is enabled
- Device appears in `droidrun devices`

## 📦 Install DroidRun Portal App

The DroidRun Portal app provides accessibility services needed for device control:

1. Download the APK from [DroidRun Portal repository](https://github.com/droidrun/droidrun-portal)
2. Install using DroidRun:
   ```bash
   droidrun setup --path=/path/to/droidrun-portal.apk
   ```

The setup command will:
1. Install the APK
2. Enable accessibility service
3. Configure necessary permissions

## 💻 Run Your First Command

Test with these commands:

```bash
# Using default (Gemini)
droidrun "Open the settings app"

# Using specific provider and model
droidrun "Open calculator" --provider Gemini --model models/gemini-2.5-pro

# With vision and planning
droidrun "Take a screenshot and describe what's on the screen" --vision --reasoning

# Using local Ollama
droidrun "Check battery level" --provider Ollama --model llama2
```

## ⚙️ Command Options

DroidRun CLI supports various options:

```bash
# Specify device
droidrun "Open Chrome" --device your_device_serial

# Set max steps
droidrun "Open settings" --steps 20

# Enable vision
droidrun "Analyze screen" --vision

# Enable planning mode
droidrun "Complex task" --reasoning

# Enable tracing (requires running 'phoenix serve' in a separate terminal first)
droidrun "Debug this" --tracing

# Adjust temperature
droidrun "Creative task" --temperature 0.7
```

## 📝 Create a Simple Script

For complex automation, create a Python script:

```python
#!/usr/bin/env python3
import asyncio
from droidrun.agent.droid import DroidAgent
from droidrun.agent.utils.llm_picker import load_llm
from droidrun.tools import load_tools

async def main():
    # Load tools and LLM
    tool_list, tools_instance = await load_tools()
    llm = load_llm(
        provider_name="Gemini",  # Case sensitive: OpenAI, Ollama, Anthropic, Gemini, DeepSeek
        model="models/gemini-2.5-pro",
        temperature=0.2
    )
    
    # Create agent
    agent = DroidAgent(
        goal="Open Settings and check battery level",
        llm=llm,
        tools_instance=tools_instance,
        tool_list=tool_list,
        vision=True,
        reasoning=True,
        enable_tracing=True  # Requires running 'phoenix serve' in a separate terminal first
    )
    
    # Run agent
    result = await agent.run()
    print(f"Success: {result['success']}")
    if result.get('output'):
        print(f"Output: {result['output']}")

if __name__ == "__main__":
    asyncio.run(main())
```

## 🔄 Using LlamaIndex Integration

DroidRun v2 uses LlamaIndex for LLM integration, providing more flexibility:

```python
import asyncio
from llama_index.core.llms import LLM
from llama_index.llms.gemini import Gemini
from droidrun.agent.droid import DroidAgent
from droidrun.tools import load_tools

async def main():
    # Load tools
    tool_list, tools_instance = await load_tools()
    
    # Create LlamaIndex LLM directly
    llm = Gemini(
        model="models/gemini-2.5-pro",
        temperature=0.2,
        additional_kwargs={"safety_settings": {"hate": "block_none"}}
    )
    
    # Or use OpenAI
    # from llama_index.llms.openai import OpenAI
    # llm = OpenAI(model="gpt-4o", temperature=0.2)
    
    # Create agent with LlamaIndex LLM
    agent = DroidAgent(
        goal="Open Settings and check battery level",
        llm=llm,
        tools_instance=tools_instance,
        tool_list=tool_list,
        vision=True,
        reasoning=True
    )
    
    # Run agent
    result = await agent.run()
    print(f"Success: {result['success']}")

if __name__ == "__main__":
    asyncio.run(main())
```

## 🔎 Vision Capabilities

When vision is enabled:

- The agent can take and analyze screenshots
- Ideal for UI-based tasks that require visual context

## 🕵️ Tracing and Debugging

DroidRun integrates with Arize Phoenix for execution tracing and debugging:

<Note>
**Important:** Before using tracing, you must start the Phoenix server in a separate terminal:

```bash
# Install Phoenix (if not already installed)
pip install "arize-phoenix[llama-index]"

# Start Phoenix server in a separate terminal
phoenix serve
```

Then enable tracing with the `--tracing` flag or `enable_tracing=True` parameter.
</Note>

Tracing provides:
- Visual execution flow
- LLM prompts and responses
- Tool execution details
- Error detection

For detailed instructions, see the [Execution Tracing](/v2/concepts/tracing) documentation.

## 📊 Token Usage Tracking

DroidRun tracks token usage for all LLM calls:

- Total prompt tokens
- Total completion tokens
- Number of API calls

This helps you optimize your automation tasks and manage costs effectively.

## 🔧 Common Installation Issues

### ADB Not Found

Ensure ADB is in your PATH or add it:

```bash
export PATH=$PATH:/path/to/android-sdk/platform-tools
```

### Device Not Detected

- Check that USB debugging is enabled on your device
- Try a different USB cable or port
- For wireless debugging, ensure device and computer are on the same network

### API Key Issues

- Verify you've correctly set the environment variable
- Ensure your API key is valid and has not expired
- Check for whitespace or extra characters in your API key

## ✅ Verify Installation

Verify DroidRun is installed correctly:

```bash
# Check installed version
pip show droidrun
```

## 🎉 Next Steps

Now that you've got DroidRun running, you can:

- Learn about the [DroidAgent system](/v2/concepts/agent)
- Explore [planning capabilities](/v2/concepts/planning)
- Discover [Android interactions](/v2/concepts/android-control)
- Learn about the [Portal App](/v2/concepts/portal-app) 