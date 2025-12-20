---
title: CLI Usage
---

# DroidRun CLI Guide: Using OpenAILike, Ollama, and Gemini Providers

DroidRun lets you control Android devices using natural language and LLM agents. This guide explains how to use the CLI with three popular LLM providers: **OpenAILike**, **Ollama**, and **Gemini**.

---

## Prerequisites

<Steps>
    <Step title="Install DroidRun and its dependencies. Choose which ever provider you'd like to use.">
       ```sh 
       pip install 'droidrun[google,anthropic,openai,deepseek,ollama,dev]'
       ```
    </Step>
    <Step title="Ensure your Android device is connected and the DroidRun Portal is installed">
       Download & Install the Droidrun Portal APK     
       ```sh 
       droidrun setup
       ```   

       Check if everything is set up correctly  
       ```sh
       droidrun ping
       ```
    </Step>
    <Step title="If you want to use a provider thats not included with our extras, install the required LlamaIndex LLM integrations">
      ```sh
      pip install llama-index-llms-openrouter
      ```
    </Step>
</Steps>
---

## General CLI Usage

The main command to run is:

```sh
droidrun run "<your natural language command>" [OPTIONS]
```

Key options:
- `--provider/-p`: LLM provider (`OpenAILike`, `Ollama`, `GoogleGenAI`, etc.)
- `--model/-m`: Model name (varies by provider)
- `--base_url/-u`: Base URL for API (for Ollama/OpenAILike)
- `--api_base`: API base URL (for OpenAI/OpenAILike)
- `--temperature`: LLM temperature (default: 0.2)
- `--vision`: Enable screenshot-based vision (flag)
- `--reasoning`: Enable planning with reasoning (flag)
- `--reflection`: Enable reflection step (flag)
- `--tracing`: Enable tracing (flag)
- `--debug`: Verbose logging (flag)

---

## Provider specific examples 
Here you can see a bunch of provider specific droidrun cli usage examples

<Expandable title="Using the OpenAILike Provider"> 
### Using the **OpenAILike** Provider

OpenAILike is for OpenAI-compatible APIs (e.g., OpenRouter, local OpenAI-compatible servers).

**Required Arguments:**
- `--provider OpenAILike`
- `--model <model-name>` (e.g., `gpt-3.5-turbo`)
- `--api_base <API endpoint>` (e.g., `https://openrouter.ai/api/v1`)

**Example:**
```sh
export OPENAI_API_KEY=<your-api-key>
droidrun run \
  --provider OpenAILike \
  --model qwen/qwen2.5-vl-72b-instruct:free \
  --api_base https://openrouter.ai/api/v1 \
  "Open the settings app"
```
</Expandable>
<Expandable title="Using the Ollama Provider">
### Using the **Ollama** Provider

Ollama is for running open-source models locally via the [Ollama server](https://ollama.com/).

**Required Arguments:**
- `--provider Ollama`
- `--model <model-name>` (e.g., `llama4`, `gemma3`)
- `--base_url <Ollama server URL>` (default: `http://localhost:11434`)

**Example:**
```sh
droidrun run \
  --provider Ollama \
  --model qwen2.5vl:3b \
  --base_url http://localhost:11434 \
  "Open the settings app"
```

No API key is required for local Ollama by default.
</Expandable>
<Expandable title="Using the Gemini Provider">
### Using the **Gemini** Provider

Gemini uses Google's Gemini models via the GoogleGenAI provider.

**Required Arguments:**
- `--provider GoogleGenAI`
- `--model <model-name>` (e.g., `gemini-2.5-flash`)
- Google API credentials (set `GOOGLE_API_KEY` env var or pass as CLI option)

**Example:**
```sh
export GOOGLE_API_KEY=<your-google-api-key>
droidrun run \
  --provider GoogleGenAI \
  --model gemini-2.5-flash \
  "Open the settings app" 
```
</Expandable>
<Expandable title="Using the DeepSeek Provider">
### Using the **DeepSeek** Provider

DeepSeek is a powerful LLM provider that can be used with DroidRun for natural language Android automation.

**Required Arguments:**
- `--provider DeepSeek`
- `--model <model-name>` (e.g., `deepseek-chat`, `deepseek-coder`, `deepseek-moe`, etc.)
- DeepSeek API credentials (set `DEEPSEEK_API_KEY` env var or pass as CLI option)

<Warning>Vision capabilities are not supported with DeepSeek models. Do not use the `--vision` flag.</Warning>

**Example:**
```sh
export DEEPSEEK_API_KEY=<your-deepseek-api-key>
droidrun run \
  --provider DeepSeek \
  --model deepseek-chat \
  "Open the settings app"
```
</Expandable>

## Additional Tips

- Use `droidrun devices` to list connected devices.
- Use `--vision` to enable screenshot-based vision for more complex tasks.
- Use `--debug` for detailed logs if troubleshooting.
- For iOS, add `--ios` and specify the device URL.

---

## Troubleshooting

- **No devices found:** Ensure your device is connected and authorized for ADB.
- **Provider errors:** Check that you have installed the correct LlamaIndex integration and set the required API keys.
- **Model not found:** Double-check the model name for your provider.

---

## References

- [DroidRun GitHub](https://github.com/droidrun/droidrun)
- [LlamaIndex Docs](https://docs.llamaindex.ai/)
- [Ollama](https://ollama.com/)
- [Google Gemini](https://ai.google.dev/)

---

**Happy automating!**
