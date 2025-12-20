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

DroidRun requires an API key from at least one of these LLM providers:

### OpenAI

1. Sign up for an account at [OpenAI](https://platform.openai.com/)
2. Create an API key in your account dashboard
3. Set the environment variable:
   ```bash
   export OPENAI_API_KEY="your_openai_api_key_here"
   ```

### Anthropic

1. Sign up for an account at [Anthropic](https://console.anthropic.com/)
2. Get your API key
3. Set the environment variable:
   ```bash
   export ANTHROPIC_API_KEY="your_anthropic_api_key_here"
   ```

### Google Gemini

1. Sign up for [Google AI Studio](https://makersuite.google.com/)
2. Create an API key
3. Set the environment variable:
   ```bash
   export GEMINI_API_KEY="your_gemini_api_key_here"
   ```

For convenience, create a `.env` file in your project directory:

```bash
# .env file example
export OPENAI_API_KEY="your_openai_api_key_here"
export ANTHROPIC_API_KEY="your_anthropic_api_key_here"
export GEMINI_API_KEY="your_gemini_api_key_here"
```

Then load it with:

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
adb devices

# OR using droidrun
droidrun devices
```

### For Wireless Debugging

```bash
# Connect to device over TCP/IP
adb tcpip 5555
adb connect 192.168.1.100:5555

# OR using droidrun
droidrun connect 192.168.1.100
```

Make sure:
- USB debugging is enabled on your device
- Your device appears in the list when running `droidrun devices`

## 📦 Install DroidRun Portal App

DroidRun requires the DroidRun Portal app to be installed on your Android device:

1. Download the DroidRun Portal APK from the [DroidRun Portal repository](https://github.com/droidrun/droidrun-portal)
2. Use DroidRun to install the portal app:
   ```bash
   droidrun setup --path=/path/to/droidrun-portal.apk
   ```

Alternatively, you can use ADB to install it manually:
```bash
adb install -r /path/to/droidrun-portal.apk
```

After installation, ensure the DroidRun Portal app is running on your device. The app provides the necessary interface for DroidRun to control your Android device through natural language commands.

## 💻 Run Your First Command

Let's run a simple command to test everything:

```bash
# Using OpenAI (default)
droidrun "Open the settings app"

# Using Gemini
droidrun "Open the calculator app" --provider gemini --model gemini-2.0-flash

# Using Anthropic
droidrun "Check the battery level" --provider anthropic --model claude-3-sonnet-20240229

# With vision capabilities enabled
droidrun "Take a screenshot and describe what's on the screen" --vision
```

## ⚙️ Command Options

DroidRun CLI supports several options:

```bash
# Specify a device
droidrun "Open Chrome" --device your_device_serial

# Set maximum steps
droidrun "Open settings" --steps 20

# Enable vision capabilities
droidrun "Analyze the current screen" --vision
```

## 📝 Create a Simple Script

For more complex automation, create a Python script:

```python
#!/usr/bin/env python3
import asyncio
import os
from droidrun.agent.react_agent import ReActAgent
from droidrun.agent.llm_reasoning import LLMReasoner
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

async def main():
    # Create an LLM instance with your preferred provider
    llm = LLMReasoner(
        llm_provider="gemini",  # "openai", "anthropic", or "gemini"
        model_name="gemini-2.0-flash",
        api_key=os.environ.get("GEMINI_API_KEY"),
        temperature=0.2,
    )
    
    # Create and run the agent
    agent = ReActAgent(
        task="Open the Settings app and search for the wifi settings",
        llm=llm,
        max_steps=20  # Set maximum number of steps
    )
    
    steps = await agent.run()
    print(f"Execution completed with {len(steps)} steps")
    
    # Get token usage statistics
    stats = llm.get_token_usage_stats()
    print(f"Total tokens used: {stats['total_tokens']}")
    print(f"Estimated cost: ${(stats['total_tokens'] / 1_000_000) * 0.10:.4f}")  # $0.10 per 1M tokens example

if __name__ == "__main__":
    asyncio.run(main())
```

Save this as `test_droidrun.py` and run:

```bash
python test_droidrun.py
```

## 🔎 Vision Capabilities

When vision is enabled:

- The agent can take and analyze screenshots
- Ideal for UI-based tasks that require visual context

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

- Learn about the [ReAct agent system](/v1/concepts/agent)
- Discover all [Android interactions](/v1/concepts/android-control) 