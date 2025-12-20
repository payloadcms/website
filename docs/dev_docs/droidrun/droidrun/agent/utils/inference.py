import asyncio
import contextvars
import threading
from concurrent.futures import TimeoutError as FuturesTimeoutError
from typing import Any, Optional


async def acall_with_retries(
    llm, messages: list, retries: int = 3, timeout: float = 500, delay: float = 1.0
) -> Any:
    """
    Call LLM with retries and timeout handling.

    Args:
        llm: The LLM client instance
        messages: List of messages to send
        retries: Number of retry attempts
        timeout: Timeout in seconds for each attempt
        delay: Base delay between retries (multiplied by attempt number)

    Returns:
        The LLM response object
    """
    last_exception: Optional[Exception] = None

    for attempt in range(1, retries + 1):
        try:
            response = await asyncio.wait_for(
                llm.achat(messages=messages),  # Use achat() instead of chat()
                timeout=timeout,
            )

            # Validate response
            if (
                response is not None
                and getattr(response, "message", None) is not None
                and getattr(response.message, "content", None)
            ):
                return response
            else:
                print(f"Attempt {attempt} returned empty content")
                last_exception = ValueError("Empty response content")

        except asyncio.TimeoutError:
            print(f"Attempt {attempt} timed out after {timeout} seconds")
            last_exception = TimeoutError("Timed out")

        except Exception as e:
            print(f"Attempt {attempt} failed with error: {e!r}")
            last_exception = e

        if attempt < retries:
            await asyncio.sleep(delay * attempt)

    if last_exception:
        raise last_exception
    raise ValueError("All attempts returned empty response content")
