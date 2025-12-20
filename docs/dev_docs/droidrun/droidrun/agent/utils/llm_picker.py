import importlib
import logging
from typing import TYPE_CHECKING, Any

from llama_index.core.llms.llm import LLM

from droidrun.agent.usage import track_usage

if TYPE_CHECKING:
    from droidrun.config_manager.config_manager import LLMProfile

# Configure logging
logger = logging.getLogger("droidrun")


def load_llm(provider_name: str, model: str | None = None, **kwargs: Any) -> LLM:
    """
    Dynamically loads and initializes a LlamaIndex LLM.

    Imports `llama_index.llms.<provider_name_lower>`, finds the class named
    `provider_name` within that module, verifies it's an LLM subclass,
    and initializes it with kwargs.

    Args:
        provider_name: The case-sensitive name of the provider and the class
                       (e.g., "OpenAI", "Ollama", "HuggingFaceLLM").
        model: The model name to use (e.g., "gpt-4", "models/gemini-2.5-pro").
               If provided, will be passed as 'model' kwarg to the LLM constructor.
        **kwargs: Keyword arguments for the LLM class constructor.

    Returns:
        An initialized LLM instance.

    Raises:
        ModuleNotFoundError: If the provider's module cannot be found.
        AttributeError: If the class `provider_name` is not found in the module.
        TypeError: If the found class is not a subclass of LLM or if kwargs are invalid.
        RuntimeError: For other initialization errors.
    """
    if not provider_name:
        raise ValueError("provider_name cannot be empty.")

    # Add model to kwargs if provided as positional argument
    if model is not None:
        kwargs["model"] = model

    if provider_name == "OpenAILike":
        module_provider_part = "openai_like"
        kwargs.setdefault("is_chat_model", True)
    elif provider_name == "GoogleGenAI":
        module_provider_part = "google_genai"
    else:
        # Use lowercase for module path, handle hyphens for package name suggestion
        lower_provider_name = provider_name.lower()
        # Special case common variations like HuggingFaceLLM -> huggingface module
        if lower_provider_name.endswith("llm"):
            module_provider_part = lower_provider_name[:-3].replace("-", "_")
        else:
            module_provider_part = lower_provider_name.replace("-", "_")
    module_path = f"llama_index.llms.{module_provider_part}"
    install_package_name = f"llama-index-llms-{module_provider_part.replace('_', '-')}"

    try:
        logger.debug(f"Attempting to import module: {module_path}")
        llm_module = importlib.import_module(module_path)
        logger.debug(f"Successfully imported module: {module_path}")

    except ModuleNotFoundError:
        logger.error(
            f"Module '{module_path}' not found. Try: pip install {install_package_name}"
        )
        raise ModuleNotFoundError(
            f"Could not import '{module_path}'. Is '{install_package_name}' installed?"
        ) from None

    try:
        logger.debug(
            f"Attempting to get class '{provider_name}' from module {module_path}"
        )
        llm_class = getattr(llm_module, provider_name)
        logger.debug(f"Found class: {llm_class.__name__}")

        # Verify the class is a subclass of LLM
        if not isinstance(llm_class, type) or not issubclass(llm_class, LLM):
            raise TypeError(
                f"Class '{provider_name}' found in '{module_path}' is not a valid LLM subclass."
            )

        # Filter out None values from kwargs
        filtered_kwargs = {k: v for k, v in kwargs.items() if v is not None}

        # Initialize
        logger.debug(
            f"Initializing {llm_class.__name__} with kwargs: {list(filtered_kwargs.keys())}"
        )
        llm_instance = llm_class(**filtered_kwargs)
        logger.debug(f"Successfully loaded and initialized LLM: {provider_name}")
        if not llm_instance:
            raise RuntimeError(
                f"Failed to initialize LLM instance for {provider_name}."
            )
        return llm_instance

    except AttributeError:
        logger.error(f"Class '{provider_name}' not found in module '{module_path}'.")
        raise AttributeError(
            f"Could not find class '{provider_name}' in module '{module_path}'. Check spelling and capitalization."
        ) from None
    except TypeError as e:
        logger.error(f"Error initializing {provider_name}: {e}")
        raise  # Re-raise TypeError (could be from issubclass check or __init__)
    except Exception as e:
        logger.error(f"An unexpected error occurred initializing {provider_name}: {e}")
        raise e


def load_llms_from_profiles(
    profiles: dict[str, "LLMProfile"],
    profile_names: list[str] | None = None,
    **override_kwargs_per_profile,
) -> dict[str, LLM]:
    """
    Load multiple LLMs from LLMProfile objects.

    Args:
        profiles: Dict of profile_name -> LLMProfile objects
        profile_names: List of profile names to load. If None, loads all profiles
        **override_kwargs_per_profile: Dict of profile-specific overrides
            Example: manager={'temperature': 0.1}, executor={'max_tokens': 8000}

    Returns:
        Dict mapping profile names to initialized LLM instances

    Example:
        >>> config = DroidrunConfig.from_yaml("config.yaml")
        >>> llms = load_llms_from_profiles(config.llm_profiles)
        >>> manager_llm = llms['manager']

        >>> # Load specific profiles with overrides
        >>> llms = load_llms_from_profiles(
        ...     config.llm_profiles,
        ...     profile_names=['manager', 'executor'],
        ...     manager={'temperature': 0.1}
        ... )
    """
    if profile_names is None:
        profile_names = list(profiles.keys())

    llms = {}
    for profile_name in profile_names:
        logger.debug(f"Loading LLM for profile: {profile_name}")

        if profile_name not in profiles:
            raise KeyError(
                f"Profile '{profile_name}' not found. "
                f"Available profiles: {list(profiles.keys())}"
            )

        profile = profiles[profile_name]

        # Get base kwargs from profile
        kwargs = profile.to_load_llm_kwargs()

        # Apply profile-specific overrides if provided
        if profile_name in override_kwargs_per_profile:
            logger.debug(
                f"Applying overrides for {profile_name}: {override_kwargs_per_profile[profile_name]}"
            )
            kwargs.update(override_kwargs_per_profile[profile_name])

        # Load the LLM
        llms[profile_name] = load_llm(provider_name=profile.provider, **kwargs)
        logger.debug(
            f"Successfully loaded {profile_name} LLM: {profile.provider}/{profile.model}"
        )

    return llms


# --- Example Usage ---
if __name__ == "__main__":
    # Install the specific LLM integrations you want to test:
    # pip install \
    #   llama-index-llms-anthropic \
    #   llama-index-llms-deepseek \
    #   llama-index-llms-gemini \
    #   llama-index-llms-openai

    from llama_index.core.base.llms.types import ChatMessage

    providers = [
        {
            "name": "Anthropic",
            "model": "claude-3-7-sonnet-latest",
        },
        {
            "name": "DeepSeek",
            "model": "deepseek-reasoner",
        },
        {
            "name": "GoogleGenAI",
            "model": "gemini-2.5-flash",
        },
        {
            "name": "OpenAI",
            "model": "gpt-4",
        },
        {
            "name": "Ollama",
            "model": "llama3.2:1b",
            "base_url": "http://localhost:11434",
        },
    ]

    system_prompt = ChatMessage(
        role="system",
        content="You are a personal health and food coach. You are given a user's health and food preferences and you need to recommend a meal plan for them. only output the meal plan, no other text.",
    )

    user_prompt = ChatMessage(
        role="user",
        content="I am a 25 year old male. I am 5'10 and 180 pounds. I am a vegetarian. I am allergic to peanuts and tree nuts. I am allergic to shellfish. I am allergic to eggs. I am allergic to dairy. I am allergic to soy. I am allergic to wheat. I am allergic to corn. I am allergic to oats. I am allergic to rice. I am allergic to barley. I am allergic to rye. I am allergic to oats. I am allergic to rice. I am allergic to barley. I am allergic to rye.",
    )

    messages = [system_prompt, user_prompt]

    for provider in providers:
        print(f"\n{'#' * 35} Loading {provider['name']} {'#' * 35}")
        print("-" * 100)

        try:
            provider_name = provider.pop("name")
            llm = load_llm(provider_name, **provider)
            provider["name"] = provider_name
            print(f"Loaded LLM: {type(llm)}")
            print(f"Model: {llm.metadata}")
            print("-" * 100)

            tracker = track_usage(llm)
            print(f"Tracker: {type(tracker)}")
            print(f"Usage: {tracker.usage}")
            print("-" * 100)

            assert tracker.usage.requests == 0
            assert tracker.usage.request_tokens == 0
            assert tracker.usage.response_tokens == 0
            assert tracker.usage.total_tokens == 0

            res = llm.chat(messages)
            print(f"Response: {res.message.content}")
            print("-" * 100)
            print(f"Usage: {tracker.usage}")

            assert tracker.usage.requests == 1
            assert tracker.usage.request_tokens > 0
            assert tracker.usage.response_tokens > 0
            assert tracker.usage.total_tokens > tracker.usage.request_tokens
            assert tracker.usage.total_tokens > tracker.usage.response_tokens
        except Exception as e:
            print(f"Failed to load and track usage for {provider['name']}: {e}")
