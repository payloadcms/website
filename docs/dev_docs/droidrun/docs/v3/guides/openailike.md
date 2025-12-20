---
title: Using Droidrun with OpenAI-like
---

This guide explains how to use the Droidrun framework with OpenAI-compatible APIs (such as OpenAI, Azure OpenAI, OpenRouter, LM Studio, etc.). By integrating these LLMs with Droidrun, you can automate Android devices, build intelligent agents, and experiment with advanced workflows using any OpenAI-like endpoint.

## What is OpenAI-like?

"OpenAI-like" refers to any API that implements the OpenAI REST API standard. This includes:
- **OpenAI** (api.openai.com)
- **Azure OpenAI**
- **OpenRouter** (https://openrouter.ai)
- **LM Studio** (local, https://lmstudio.ai)
- **Other local or cloud endpoints** that mimic the OpenAI API

## Why Use OpenAI-like with Droidrun?

- **Flexibility:** Use cloud or local LLMs interchangeably.
- **Wide Model Support:** Access GPT-3.5, GPT-4, and many community models.
- **Easy Integration:** Droidrun supports OpenAI-compatible LLMs out of the box.

## Prerequisites

- **Python 3.10+**
- **An API key** for your chosen provider (e.g., OpenAI, OpenRouter, Azure, or local server)
- **droidrun** framework installed (see [Droidrun Quickstart](../quickstart))
<Warning>
Make sure you've set up and enabled the Droidrun Portal.
</Warning>


## 1. Set Up Your API Key

Get your API key for the provider you've choosen

## 2. Install the required Python packages:

```sh
pip install 'droidrun[openai]'
```

## 3. Example: Using Droidrun with OpenAI-like LLM

Here is a minimal example of using Droidrun with an OpenAI-compatible LLM backend:

```python
import asyncio
from llama_index.llms.openai_like import OpenAILike
from droidrun import DroidAgent, AdbTools

async def main():
    # Load adb tools for the first connected device
    tools = AdbTools()

    # Set up the OpenAI-like LLM (uses env vars for API key and base by default)
    llm = OpenAILike(
        model="gpt-3.5-turbo",  # or "gpt-4o", "gpt-4", etc.
        api_base="http://localhost:1234/v1",  # For local endpoints
        is_chat_model=True, # droidrun requires chat model support
        api_key="YOUR API KEY"
    )

    # Create the DroidAgent
    agent = DroidAgent(
        goal="Open Settings and check battery level",
        llm=llm,
        tools=tools,
        vision=False,        # Set to True if your model supports vision
        reasoning=False,     # Optional: enable planning/reasoning
    )

    # Run the agent
    result = await agent.run()
    print(f"Success: {result['success']}")
    if result.get('output'):
        print(f"Output: {result['output']}")

if __name__ == "__main__":
    asyncio.run(main())
```

### Tips for Local and Alternative Endpoints

- **OpenRouter:** Set `api_base` to `https://openrouter.ai/api/v1` and use your OpenRouter API key.
- **LM Studio:** Set `api_base` to your local server URL (e.g., `http://localhost:1234/v1`).
- **Azure OpenAI:** Use the Azure-specific API base and deployment name as the model.
- **Custom headers:** Some endpoints require extra headers; see their docs.

## 4. Troubleshooting

- **Authentication errors:** Double-check your API key and endpoint.
- **Model not found:** Ensure the model name matches what your provider supports.
- **Connection errors:** If using a local server, make sure it is running and accessible.
- **Vision:** Most OpenAI-like endpoints do not support image input. Set `vision=False` unless you know your model supports it.

## 5. Further Reading

- [OpenRouter Docs](https://openrouter.ai/docs)
- [LM Studio Docs](https://lmstudio.ai/docs)
- [llama-index OpenAI Like LLM Docs](https://docs.llamaindex.ai/en/stable/api_reference/llms/openai_like/)

---

With this setup, you can use any OpenAI-compatible LLM for Android automation and agent-based workflows using Droidrun!
