"""
Tracing setup utility for DroidAgent.

This module provides a centralized way to configure tracing providers
(Phoenix, Langfuse, etc.) based on the TracingConfig.
"""

import logging
import os
from typing import Optional
from uuid import uuid4

import llama_index.core

from droidrun.config_manager.config_manager import TracingConfig

logger = logging.getLogger("droidrun")

_default_session_id: str = str(uuid4())
_session_id: str = _default_session_id
_tracing_initialized: bool = False
_tracing_provider: Optional[str] = None
_user_id: str = "anonymous"


def setup_tracing(
    tracing_config: TracingConfig, agent: Optional[object] = None
) -> None:
    global _tracing_initialized, _tracing_provider, _session_id, _user_id

    if not tracing_config.enabled:
        return

    provider = tracing_config.provider.lower()

    if tracing_config.langfuse_session_id:
        _session_id = tracing_config.langfuse_session_id
    else:
        _session_id = _default_session_id

    if tracing_config.langfuse_user_id:
        _user_id = tracing_config.langfuse_user_id
    else:
        _user_id = "anonymous"

    if _tracing_initialized:
        logger.info(
            f"🔍 Tracing already initialized with {_tracing_provider}, skipping setup"
        )
        if provider == "langfuse" and agent:
            from droidrun.telemetry.langfuse_processor import set_current_agent

            set_current_agent(agent)
        return

    if provider == "phoenix":
        _setup_phoenix_tracing()
        _tracing_initialized = True
        _tracing_provider = "phoenix"
    elif provider == "langfuse":
        _setup_langfuse_tracing(tracing_config, agent)
        _tracing_initialized = True
        _tracing_provider = "langfuse"
        logger.info(f"🔍 Langfuse tracing enabled | Session: {_session_id}")
    else:
        logger.warning(
            f"⚠️  Unknown tracing provider: {provider}. "
            f"Supported providers: phoenix, langfuse"
        )


def _setup_phoenix_tracing() -> None:
    """Set up Arize Phoenix tracing."""
    try:
        from droidrun.telemetry.phoenix import arize_phoenix_callback_handler

        handler = arize_phoenix_callback_handler()
        llama_index.core.global_handler = handler
        llama_index.core.set_global_handler
        logger.info("🔍 Arize Phoenix tracing enabled globally")
    except ImportError:
        logger.warning(
            "⚠️  Arize Phoenix is not installed.\n"
            "    To enable Phoenix integration, install with:\n"
            "    • If installed via tool: `uv tool install droidrun[phoenix]`"
            "    • If installed via pip: `uv pip install droidrun[phoenix]`\n"
        )


def _setup_langfuse_tracing(
    tracing_config: TracingConfig, agent: Optional[object] = None
) -> None:
    """
    Set up Langfuse tracing with custom span processor.

    Args:
        tracing_config: TracingConfig instance containing Langfuse credentials
        agent: Optional DroidAgent instance to pass to span processor
    """

    try:
        # Set environment variables
        if tracing_config.langfuse_secret_key:
            os.environ["LANGFUSE_SECRET_KEY"] = tracing_config.langfuse_secret_key
        if tracing_config.langfuse_public_key:
            os.environ["LANGFUSE_PUBLIC_KEY"] = tracing_config.langfuse_public_key
        if tracing_config.langfuse_host:
            os.environ["LANGFUSE_HOST"] = tracing_config.langfuse_host
        else:
            os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com"

        # Verify credentials
        from langfuse import Langfuse

        langfuse = Langfuse()
        try:
            if not langfuse.auth_check():
                logger.error(
                    "❌ Langfuse authentication failed. Please check your credentials."
                )
                return
        except Exception as e:
            logger.error(
                f"Error checking Langfuse authentication: {e}\nLikely a network issue or credentials are incorrect"
            )
            return

        # STEP 1: Set up tracer provider (before any LlamaIndex imports!)
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry import trace

        # Check if there's already a tracer provider (from Phoenix or previous setup)
        existing_provider = trace.get_tracer_provider()
        if hasattr(existing_provider, "add_span_processor"):
            # Use existing provider
            tracer_provider = existing_provider
            logger.info("🔍 Using existing TracerProvider")
        else:
            # Create new provider
            tracer_provider = TracerProvider()
            trace.set_tracer_provider(tracer_provider)
            logger.info("🔍 Created new TracerProvider")

        # STEP 2: Instrument LlamaIndex FIRST (before any LlamaIndex imports!)
        from openinference.instrumentation.llama_index import LlamaIndexInstrumentor

        instrumentor = LlamaIndexInstrumentor()
        if not instrumentor.is_instrumented_by_opentelemetry:
            instrumentor.instrument()
            logger.info("🔍 Instrumented LlamaIndex")
        else:
            logger.info("🔍 LlamaIndex already instrumented")

        # STEP 3: Patch the encoder (now that instrumentation is active)
        from pydantic import BaseModel as PydanticV2BaseModel
        from openinference.instrumentation.llama_index import _handler

        _original_encoder = _handler._encoder

        def _fixed_encoder(obj):
            """Fixed encoder that properly handles Pydantic v2 models."""
            if isinstance(obj, PydanticV2BaseModel):
                return obj.model_dump()
            return _original_encoder(obj)

        _handler._encoder = _fixed_encoder

        # STEP 4: Add our custom processor (after instrumentation is set up)
        from droidrun.telemetry.langfuse_processor import (
            LangfuseSpanProcessor,
            set_current_agent,
        )

        if agent:
            set_current_agent(agent)

        span_processor = LangfuseSpanProcessor(
            public_key=os.environ["LANGFUSE_PUBLIC_KEY"],
            secret_key=os.environ["LANGFUSE_SECRET_KEY"],
            base_url=os.environ["LANGFUSE_HOST"],
        )
        tracer_provider.add_span_processor(span_processor)

    except ImportError as e:
        logger.warning(
            "⚠️  Langfuse dependencies are not installed.\n"
            "    To enable Langfuse integration, install with:\n"
            "    • If installed via tool: `uv tool install droidrun[langfuse]`\n"
            "    • If installed via pip: `uv pip install droidrun[langfuse]`\n"
            f"    Missing: {e.name if hasattr(e, 'name') else str(e)}\n"
        )


def apply_session_context() -> None:
    from opentelemetry.context import attach, get_current, set_value
    from openinference.semconv.trace import SpanAttributes

    ctx = get_current()
    ctx = set_value(SpanAttributes.SESSION_ID, _session_id, ctx)
    ctx = set_value(SpanAttributes.USER_ID, _user_id, ctx)
    attach(ctx)
