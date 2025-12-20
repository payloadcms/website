---
title: Using Droidrun with Ollama
---

This guide explains how to use the Droidrun framework with [Ollama](https://ollama.com/), an open-source platform for running large language models (LLMs) locally. By integrating Ollama with Droidrun, you can leverage powerful local LLMs to automate Android devices, build intelligent agents, and experiment with advanced workflows.

## What is Ollama?

Ollama lets you run, manage, and interact with LLMs on your own machine. It supports a variety of modern models (e.g., Qwen2.5vl, Gemma3, DeepSeek, Llama 4, etc.) and provides a simple HTTP API for integration.

## Why Use Ollama with Droidrun?

- **Privacy:** Run LLMs locally without sending data to the cloud.
- **Performance:** Low-latency inference on your own hardware.
- **Flexibility:** Choose and switch between different models easily.
- **Cost:** No API usage fees.

## Prerequisites

- **Ollama** installed and running on your machine ([installation guide](https://ollama.com/download)).
- **Python 3.10+**
- **droidrun** framework installed (see [Droidrun Quickstart](../quickstart.mdx)).
<Warning>
Make sure you've set up and enabled the Droidrun Portal.
</Warning>


## 1. Install and Start Ollama

Download and install Ollama from the [official website](https://ollama.com/download). Once installed, start the Ollama server:

```sh
ollama serve
```

Pull a modern model you want to use (e.g., Qwen2.5vl, Gemma3, DeepSeek, Llama 4):

```sh
ollama pull qwen2.5vl
ollama pull gemma3
ollama pull deepseek-r1 # no vision capabilities. can only be used with vision disabled
ollama pull llama4
```

## 2. Install Required Python Packages

Make sure you have the required Python packages:

```sh
pip install 'droidrun[ollama]'
```

## 3. Example: Using Droidrun with Ollama LLM

Here is a minimal example of using Droidrun with Ollama as the LLM backend (using a modern model, e.g., Qwen2.5vl):

```python
import asyncio
from llama_index.llms.ollama import Ollama
from droidrun import DroidAgent, AdbTools

async def main():
    # load adb tools for the first connected device
    tools = AdbTools()

    # Set up the Ollama LLM with a modern model
    llm = Ollama(
        model="qwen2.5vl",                  # or "gemma3", "deepseek", "llama4", etc.
        base_url="http://localhost:11434",  # default Ollama endpoint
        context_window=8192,                # limit the max context window to prevent running out of memory. 
        request_timeout=120.0               # increase the request timeout
    )

    # Create the DroidAgent
    agent = DroidAgent(
        goal="Open Settings and check battery level",
        llm=llm,
        tools=tools,
        vision=False,         # Optional: enable vision. use vision=True only in conjunction with a vision model
        reasoning=True,       # Optional: enable planning/reasoning. Read more about the agent configuration in Core-Concepts/Agent
    )

    # Run the agent
    result = await agent.run()
    print(f"Success: {result['success']}")
    if result.get('output'):
        print(f"Output: {result['output']}")

if __name__ == "__main__":
    asyncio.run(main())
```

<Note>Limiting the llm's context_window reduces memory usage, but degrades the agent's performance too. For the best results try extending it as much as possible.</Note>

## 4. Troubleshooting

- **Ollama not running:** Make sure `ollama serve` is running and accessible at `http://localhost:11434`.
- **Model not found:** Ensure you have pulled the desired model with `ollama pull <model>`.
- **Connection errors:** Check firewall settings and that the endpoint URL is correct.
- **Timeout:** If Ollama is running behind a proxy like Cloudflare, make sure the request timeout is configured high enough
- **Performance:** Some models require significant RAM/CPU. Try smaller models if you encounter issues.
- **Compatibility:** Vision models do not run correctly on apple silicon chips. Check [issue #55 (droidrun)](https://github.com/droidrun/droidrun/issues/55#issuecomment-2959912711), [issue @ ollama](https://github.com/ollama/ollama/issues/10986)

## 5. Tips

- You can switch models by changing the `model` parameter in the `Ollama` constructor.
- Explore different models available via `ollama list`.
- For advanced configuration, see the [DroidAgent documentation](../concepts/agent) and [Ollama API docs](https://github.com/jmorganca/ollama/blob/main/docs/README.md).

---

With this setup, you can harness the power of local, state-of-the-art LLMs for Android automation and agent-based workflows using Droidrun and Ollama!
