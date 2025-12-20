import logging
import re
from typing import List, Optional, Tuple, Union
from pathlib import Path
from PIL import Image
from io import BytesIO

from llama_index.core.base.llms.types import ChatMessage, ImageBlock, TextBlock

from droidrun.telemetry.phoenix import clean_span

logger = logging.getLogger("droidrun")


def message_copy(message: ChatMessage, deep=True) -> ChatMessage:
    if deep:
        copied_message = message.model_copy()
        copied_message.blocks = [block.model_copy() for block in message.blocks]

        return copied_message
    copied_message = message.model_copy()

    # Create a new, independent list containing the same block references
    copied_message.blocks = list(message.blocks)  # or original_message.blocks[:]

    return copied_message


async def add_screenshot_image_block(
    screenshot, chat_history: List[ChatMessage], copy=True
) -> None:
    if screenshot:
        image_block = ImageBlock(image=screenshot)
        if copy:
            chat_history = (
                chat_history.copy()
            )  # Create a copy of chat history to avoid modifying the original
            chat_history[-1] = message_copy(chat_history[-1])
        chat_history[-1].blocks.append(image_block)
    return chat_history


async def add_device_state_block(
    formatted_device_state: str, chat_history: List[ChatMessage], copy: bool = True
) -> List[ChatMessage]:
    """
    Add formatted device state to the LAST user message in chat history.

    This follows the pattern of other chat_utils functions:
    - Doesn't create a new message
    - Appends to last user message content
    - Prevents device state from being saved to every message in memory

    Args:
        formatted_device_state: Complete formatted device state text
        chat_history: Current chat history
        copy: Whether to copy the history before modifying (default: True)

    Returns:
        Updated chat history with device state in last user message
    """
    if not formatted_device_state or not formatted_device_state.strip():
        return chat_history

    if not chat_history:
        return chat_history

    # Create device state block
    device_state_block = TextBlock(text=f"\n{formatted_device_state}\n")

    # Copy history if requested
    if copy:
        chat_history = chat_history.copy()
        chat_history[-1] = message_copy(chat_history[-1])

    # Append to last message blocks
    chat_history[-1].blocks.append(device_state_block)

    return chat_history


async def add_memory_block(
    memory: List[str], chat_history: List[ChatMessage]
) -> List[ChatMessage]:
    memory_block = "\n### Remembered Information:\n"
    for idx, item in enumerate(memory, 1):
        memory_block += f"{idx}. {item}\n"

    for i, msg in enumerate(chat_history):
        if msg.role == "user":
            if isinstance(msg.content, str):
                updated_content = f"{memory_block}\n\n{msg.content}"
                chat_history[i] = ChatMessage(role="user", content=updated_content)
            elif isinstance(msg.content, list):
                memory_text_block = TextBlock(text=memory_block)
                content_blocks = [memory_text_block] + msg.content
                chat_history[i] = ChatMessage(role="user", content=content_blocks)
            break
    return chat_history


def extract_code_and_thought(response_text: str) -> Tuple[Optional[str], str]:
    """
    Extracts code from Markdown blocks (```python ... ```) and the surrounding text (thought).
    Finds the first and last ``` markers and extracts everything between them.

    Returns:
        Tuple[Optional[code_string], thought_string]
    """
    logger.debug("✂️ Extracting code and thought from response...")

    first_backticks = response_text.find("```")
    if first_backticks == -1:
        logger.debug("  - No code block found. Entire response is thought.")
        return None, response_text.strip()

    last_backticks = response_text.rfind("```")
    if first_backticks == last_backticks:
        logger.debug(
            "  - Only one code block marker found. Entire response is thought."
        )
        return None, response_text.strip()

    code_block = response_text[first_backticks : last_backticks + 3]

    if code_block.startswith("```python"):
        code_content = code_block[9:]
    elif code_block.startswith("```py"):
        code_content = code_block[5:]
    else:
        code_content = code_block[3:]

    if code_content.endswith("```"):
        code_content = code_content[:-3]

    extracted_code = code_content.strip()

    thought_before = response_text[:first_backticks].strip()
    thought_after = response_text[last_backticks + 3 :].strip()
    thought_text = (thought_before + " " + thought_after).strip()

    thought_preview = (
        (thought_text[:100] + "...") if len(thought_text) > 100 else thought_text
    )
    logger.debug(f"  - Extracted thought: {thought_preview}")

    return extracted_code, thought_text


def has_non_empty_content(msg):
    content = msg.get("content", [])
    if not content:  # Empty list or None
        return False
    # Check if any content item has non-empty text
    for item in content:
        if isinstance(item, dict) and item.get("text", "").strip():
            return True
        elif isinstance(item, str) and item.strip():
            return True
    return False


def remove_empty_messages(messages):
    """Remove empty messages and duplicates, with span decoration."""
    if not messages or all(has_non_empty_content(msg) for msg in messages):
        return messages

    @clean_span("remove_empty_messages")
    def process_messages():
        # Remove empty messages first
        cleaned = [msg for msg in messages if has_non_empty_content(msg)]

        # Remove duplicates based on content
        seen_contents = set()
        unique_messages = []
        for msg in cleaned:
            content = msg.get("content", [])
            content_str = str(content)  # Simple string representation for deduplication
            if content_str not in seen_contents:
                seen_contents.add(content_str)
                unique_messages.append(msg)

        logger.debug(
            f"Removed empty messages and duplicates: {len(messages)} -> {len(unique_messages)}"
        )
        return unique_messages

    return process_messages()


def image_to_image_bytes(image_source: Union[str, Path, Image.Image, bytes]) -> bytes:
    """
    Convert image to bytes for ImageBlock.

    Args:
        image_source: Can be:
            - str/Path: path to image file
            - PIL.Image.Image: PIL Image object
            - bytes: bytes of image

    Returns:
        Image bytes in PNG format
    """
    if isinstance(image_source, (str, Path)):
        image = Image.open(image_source)
    elif isinstance(image_source, Image.Image):
        image = image_source
    elif isinstance(image_source, bytes):
        return image_source
    else:
        raise ValueError(f"Unsupported image source type: {type(image_source)}")

    buffer = BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


def convert_messages_to_chatmessages(messages: list[dict]) -> list[ChatMessage]:
    """
    Convert dict messages to llama-index ChatMessage format.

    Dict format (input):
        {
            "role": "user" | "assistant" | "system",
            "content": [
                {"text": "some text"},
                {"image": "/path/to/image.png"}  # or PIL Image
            ]
        }

    ChatMessage format (output):
        ChatMessage(
            role="user",
            blocks=[
                TextBlock(text="some text"),
                ImageBlock(image=b"...bytes...")
            ]
        )

    Args:
        messages: List of message dicts

    Returns:
        List of ChatMessage objects
    """
    chat_messages = []

    for message in messages:
        blocks = []

        for item in message["content"]:
            if "text" in item:
                blocks.append(TextBlock(text=item["text"]))
            elif "image" in item:
                # Convert image to bytes
                image_bytes = image_to_image_bytes(item["image"])
                blocks.append(ImageBlock(image=image_bytes))

        chat_messages.append(ChatMessage(role=message["role"], blocks=blocks))

    return chat_messages
