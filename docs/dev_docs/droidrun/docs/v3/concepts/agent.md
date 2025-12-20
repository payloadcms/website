---
title: 'Agent & Execution Modes'
description: 'Understanding the DroidAgent system in DroidRun'
---


## Configuration

```python
# The parameters for the DroidAgent
def __init__(
    self, 
    goal: str,                                  # The goal for the agent to reach
    llm: LLM,                                   # Language model to use
    tools: Tools,                               # Loaded tools
    personas: List[AgentPersona] = [DEFAULT],   # Experimental: custom system prompt for agent
    max_steps: int = 15,                        # Maximum steps the agent takes
    timeout: int = 1000,                        # Global Timeout
    vision: bool = False,                       # Whether the agent shall also utilize screenshots
    reasoning: bool = False,                    # Enable reasoning
    reflection: bool = False,                   # Enable reflection
    enable_tracing: bool = False,               # Enable tracing (this requires arize phoenix)
    debug: bool = False,                        # Enable additional debug logs
    save_trajectories: str = "none",            # Trajectory saving level: "none" (no saving), "step" (save per step), "action" (save per action)
    *args,
    **kwargs
)
```

## Execution Modes

The agent operates in three distinct modes, each optimized for different complexity levels and use cases.

### Direct Execution
<div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
  <span style={{background: 'rgba(107, 114, 128, 0.2)', color: '#6b7280', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold'}}>REASONING: LOW</span>
  <span style={{background: 'rgba(13, 147, 115, 0.2)', color: '#0D9373', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold'}}>SPEED: HIGH</span>
</div>

```python
# Simple tasks
agent = DroidAgent(
    goal="Take a screenshot of the current screen",
    llm=llm,
    tools=tools,
    reasoning=False
)
```
**Flow:** Goal → Direct Execution → Result

**Best Practices:**
- Use for single-action tasks (1-15 steps)
- Keep goals specific and atomic
- Faster execution with no planning overhead

### Planning Mode
<div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
  <span style={{background: 'rgba(217, 119, 6, 0.2)', color: '#d97706', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold'}}>REASONING: MEDIUM</span>
  <span style={{background: 'rgba(217, 119, 6, 0.2)', color: '#d97706', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold'}}>SPEED: MEDIUM</span>
</div>

```python
# Multi-step tasks requiring navigation and decision-making
agent = DroidAgent(
    goal="Set up a new alarm for 7 AM with custom ringtone and label 'Work'",
    llm=llm,
    tools=tools,
    reasoning=True
)
```
**Flow:** Goal → Planning → Step-by-step Execution → Result

**Best Practices:**
- Use for multi-step tasks (15-50 steps)
- Ideal for navigation between apps/screens
- Good for tasks requiring step-by-step breakdown


### Reflection Mode
<div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
  <span style={{background: 'rgba(13, 147, 115, 0.2)', color: '#0D9373', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold'}}>REASONING: HIGH</span>
  <span style={{background: 'rgba(107, 114, 128, 0.2)', color: '#6b7280', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold'}}>SPEED: LOW</span>
</div>

```python
# Complex, multi-app workflows requiring verification and adaptive planning
agent = DroidAgent(
    goal="Find the cheapest hotel in Manhattan for next weekend, compare prices across multiple booking apps, and share the best option with my team on Slack",
    llm=llm,
    tools=tools,
    reasoning=True,
    reflection=True
)
```
<Warning>Reflection is based on screenshots. Use it alongside an LLM model with vision capabilities (e.g., GPT-4o, Gemini-2.5-Flash etc.).</Warning>
**Flow:** Goal → Planning → Execution → Reflection → Re-planning (if needed) → Result

**Best Practice:**
- Use for complex workflows (50+ steps)
- Essential for quality control and verification
- Best when context preservation is critical

## Vision capabilities
<Warning>Vision capabilities are deactivated for the DeepSeek provider and require an LLM model with vision capabilities (e.g., GPT-4o, Gemini-2.5-Flash etc.).</Warning>

By default, DroidAgent operates entirely without vision by leveraging Android's Accessibility API to extract the UI hierarchy as XML. This approach is efficient and works well for most automation tasks.

However, enabling vision capabilities allows the agent to take screenshots and visually analyze the device screen, which can be beneficial in specific scenarios:
```python
# To enable vision capabilities, set `vision=True` in your agent configuration. 
agent = DroidAgent(
    goal="Open up TikTok and describe the content of the video you are seeing",
    llm=llm,
    tools=tools,
    vision=True
)
```


- **Content-heavy applications**: When apps contain complex visual elements, images, or layouts that aren't fully captured by the XML hierarchy
- **Visual verification**: For tasks requiring confirmation of visual elements or layouts
- **Enhanced context understanding**: When UI structure alone doesn't provide sufficient information for decision-making

