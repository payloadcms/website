---
title: Using Droidrun with Gemini
---

This guide explains how to use the Droidrun framework with [Gemini](https://ai.google.dev/gemini-api/docs/), Google's family of advanced large language models. By integrating Gemini with Droidrun, you can leverage powerful cloud-based LLMs to automate Android devices, build intelligent agents, and experiment with advanced workflows.

## What is Gemini?

Gemini is a suite of state-of-the-art language models developed by Google, available via the Gemini API. It supports text, code, and multimodal (vision) capabilities, and is accessible through a simple HTTP API.

## Why Use Gemini with Droidrun?

- **Accuracy:** Access to Google's latest, high-quality LLMs.
- **Multimodal:** Supports both text and vision (image) inputs.
- **Scalability:** Cloud-based, no local hardware requirements.

## Prerequisites

- **Google Cloud account** with access to the Gemini API.
- **Python 3.10+**
- **droidrun** framework installed (see [Droidrun Quickstart](../quickstart.mdx)).
<Warning>
Make sure you've set up and enabled the Droidrun Portal.
</Warning>


## 1. Set Up Gemini API Access

1. Go to the [Gemini API Console](https://ai.google.dev/gemini-api/docs/get-api-key) and create an API key.
2. Save your API key securely. You will use it in your Python code.

## 2. Install Required Python Packages

```sh
pip install 'droidrun[google]'
```

## 3. Example: Using Droidrun with Gemini LLM

Here is a minimal example of using Droidrun with Gemini as the LLM backend:

```python
import asyncio
from llama_index.llms.google_genai import GoogleGenAI
from droidrun import DroidAgent, AdbTools

async def main():
    # load adb tools for the first connected device
    tools = AdbTools()

    # Set up the Gemini LLM
    llm = GoogleGenAI(
        api_key="YOUR_GEMINI_API_KEY",  # Replace with your Gemini API key
        model="gemini-2.5-flash",       # or "gemini-2.5-pro" for enhanced reasoning
    )

    # Create the DroidAgent
    agent = DroidAgent(
        goal="Open Settings and check battery level",
        llms=llm,
        tools=tools,
        # vision=True,        # Optional: enable if using multimodal models
        # reasoning=False,    # Optional: enable planning/reasoning
    )

    # Run the agent
    result = await agent.run()
    print(f"Success: {result['success']}")
    if result.get('output'):
        print(f"Output: {result['output']}")

if __name__ == "__main__":
    asyncio.run(main())
```

## 4. Troubleshooting

- **Invalid API key:** Double-check your Gemini API key and permissions.
- **Model not found:** Use the correct model name, e.g., `"gemini-2.5-flash"` or `"gemini-2.5-pro"`.
- **Quota exceeded:** Check your Google Cloud usage and quotas.
- **Connection errors:** Ensure your network allows outbound HTTPS requests to the Gemini API.

## 5. Tips

- For advanced configuration, see the [DroidAgent documentation](../concepts/agent) and [Gemini API docs](https://ai.google.dev/gemini-api/docs/).
- Store your API key securely (e.g., use environment variables or a secrets manager).

---

With this setup, you can harness the power of Google's Gemini models for Android automation and agent-based workflows using Droidrun!
