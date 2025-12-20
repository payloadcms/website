# Changelog

All notable changes to the Droidrun project will be documented in this file.

## [0.2.0] - 2025-05-21

### Added
- **New LLM Providers**
  - Added support for Ollama (local LLM models)
  - Added support for DeepSeek models
  - Case-sensitive provider names: OpenAI, Anthropic, Gemini, Ollama, DeepSeek

- **Planning System**
  - Added DroidAgent with planning capabilities for complex tasks
  - Introduced task decomposition for multi-step operations

- **LlamaIndex Integration**
  - Replaced custom LLM wrapper with LlamaIndex integration
  - Added direct support for LlamaIndex LLM classes

- **Tracing and Debugging**
  - Added integration with Arize Phoenix for execution tracing
  - Added token usage analysis
  - Added execution time metrics

- **CLI Enhancements**
  - Added `--reasoning` flag to enable planning capabilities
  - Added `--tracing` flag for execution tracing with Phoenix

- **Documentation**
  - Added comprehensive documentation for new features
  - Created dedicated pages for planning and tracing
  - Updated all examples to reflect new API patterns

### Changed
- **Agent Architecture**
  - Replaced ReActAgent with the new DroidAgent system
  - Refactored agent initialization to use tools_instance and tool_list
  - Changed API from `task` parameter to `goal` parameter

### Deprecated
- Old agent initialization pattern with `device_serial` parameter
- Direct LLM provider initialization (replaced by LlamaIndex)
- Non-case-sensitive provider names

### Removed
- ReActAgent class (replaced by DroidAgent)
- LLMReasoner class (replaced by LlamaIndex)
- Some previously documented tools that were not fully implemented

### Fixed
- Various UI interaction issues
- Improved error handling in device connections
- More reliable Android element detection
