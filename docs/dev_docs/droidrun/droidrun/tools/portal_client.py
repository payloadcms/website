"""
Portal Client - Unified communication layer for DroidRun Portal app.

This module provides automatic TCP/Content Provider fallback for Portal communication.
"""

import asyncio
import base64
import io
import json
import logging
import re
from typing import Any, Dict, List, Optional

import httpx
from async_adbutils import AdbDevice

logger = logging.getLogger("droidrun")

PORTAL_REMOTE_PORT = 8080  # Port on device where Portal HTTP server runs


class PortalClient:
    """
    Unified client for DroidRun Portal communication.

    Automatically handles TCP vs Content Provider fallback with the following strategy:
    - On init, checks for existing port forward and reuses it
    - If no forward exists, creates new one
    - Tests connection and sets tcp_available flag
    - All methods auto-select TCP or content provider based on availability
    - Port forwards persist until device disconnect (no explicit cleanup needed)

    Key features:
    - Reuses existing port forwards (no cleanup needed)
    - Automatic fallback to content provider if TCP fails
    - Zero explicit resource management
    - Graceful degradation

    Note: TCP mode is significantly faster but requires ADB port forwarding.
    Content provider mode works without port forwarding but has higher latency.
    """

    def __init__(self, device: AdbDevice, prefer_tcp: bool = False):
        """
        Initialize Portal client.

        Args:
            device: ADB device instance
            prefer_tcp: Whether to prefer TCP communication (will fallback to content provider if unavailable)

        Note:
            Call `await client.connect()` after initialization to establish connection.
        """
        self.device = device
        self.prefer_tcp = prefer_tcp
        self.tcp_available = False
        self.tcp_base_url = None
        self.local_tcp_port = None
        self._connected = False

    async def connect(self) -> None:
        """
        Establish connection...
        """
        if self._connected:
            return

        if self.prefer_tcp:
            await self._try_enable_tcp()

        self._connected = True

    async def _ensure_connected(self) -> None:
        """Check if connected, raise error if not."""
        if not self._connected:
            await self.connect()

    async def _try_enable_tcp(self) -> None:
        """
        Try to enable TCP communication. Fails silently and falls back to content provider.

        Strategy:
        1. Check if forward already exists → reuse
        2. If not, create new forward
        3. Test connection with ping
        4. Set tcp_available flag
        """
        try:
            # Step 1: Check for existing forward
            local_port = await self._find_existing_forward()

            # Step 2: If no forward exists, create one
            if local_port is None:
                logger.debug(
                    f"No existing forward found, creating new forward for port {PORTAL_REMOTE_PORT}"
                )
                local_port = await self.device.forward_port(PORTAL_REMOTE_PORT)
                logger.debug(
                    f"Created forward: localhost:{local_port} -> device:{PORTAL_REMOTE_PORT}"
                )
            else:
                logger.debug(
                    f"Reusing existing forward: localhost:{local_port} -> device:{PORTAL_REMOTE_PORT}"
                )

            # Store local port
            self.local_tcp_port = local_port

            # Step 3: Test connection
            self.tcp_base_url = f"http://localhost:{local_port}"
            if await self._test_connection():
                self.tcp_available = True
                logger.info(f"✓ TCP mode enabled: {self.tcp_base_url}")
            else:
                logger.warning(
                    "TCP connection test failed, falling back to content provider"
                )
                self.tcp_available = False

        except Exception as e:
            logger.warning(
                f"Failed to setup TCP forwarding: {e}. Using content provider fallback."
            )
            self.tcp_available = False

    async def _find_existing_forward(self) -> Optional[int]:
        """
        Check if a forward already exists for the Portal remote port.

        Returns:
            Local port number if forward exists, None otherwise
        """
        try:
            forwards = []
            async for forward in self.device.forward_list():
                forwards.append(forward)
            # forwards is a list of ForwardItem objects with serial, local, remote attributes
            for forward in forwards:
                if (
                    forward.serial == self.device.serial
                    and forward.remote == f"tcp:{PORTAL_REMOTE_PORT}"
                ):
                    # Extract local port from "tcp:12345"
                    match = re.search(r"tcp:(\d+)", forward.local)
                    if match:
                        local_port = int(match.group(1))
                        logger.debug(
                            f"Found existing forward: localhost:{local_port} -> {PORTAL_REMOTE_PORT}"
                        )
                        return local_port
        except Exception as e:
            logger.debug(f"Failed to check existing forwards: {e}")

        return None

    async def _test_connection(self) -> bool:
        """Test if TCP connection to Portal is working."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.tcp_base_url}/ping", timeout=5)
                return response.status_code == 200
        except Exception as e:
            logger.debug(f"TCP connection test failed: {e}")
            return False

    def _parse_content_provider_output(
        self, raw_output: str
    ) -> Optional[Dict[str, Any]]:
        """
        Parse the raw ADB content provider output and extract JSON data.

        Args:
            raw_output: Raw output from ADB content query command

        Returns:
            Parsed JSON data or None if parsing failed
        """
        lines = raw_output.strip().split("\n")

        # Try line-by-line parsing
        for line in lines:
            line = line.strip()

            # Look for "result=" pattern (common content provider format)
            if "result=" in line:
                result_start = line.find("result=") + 7
                json_str = line[result_start:]
                try:
                    json_data = json.loads(json_str)
                    # Handle nested "data" field with JSON string
                    if isinstance(json_data, dict) and "data" in json_data:
                        if isinstance(json_data["data"], str):
                            return json.loads(json_data["data"])
                    return json_data
                except json.JSONDecodeError:
                    continue

            # Fallback: try lines starting with JSON
            elif line.startswith("{") or line.startswith("["):
                try:
                    return json.loads(line)
                except json.JSONDecodeError:
                    continue

        # Last resort: try parsing entire output
        try:
            return json.loads(raw_output.strip())
        except json.JSONDecodeError:
            return None

    async def get_state(self) -> Dict[str, Any]:
        """
        Get device state (accessibility tree + phone state).
        Auto-selects TCP or content provider.

        Returns:
            Dictionary containing 'a11y_tree' and 'phone_state' keys
        """
        await self._ensure_connected()
        if self.tcp_available:
            return await self._get_state_tcp()
        return await self._get_state_content_provider()

    async def _get_state_tcp(self) -> Dict[str, Any]:
        """Get state via TCP."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.tcp_base_url}/state_full", timeout=10
                )
                if response.status_code == 200:
                    data = response.json()

                    # Handle nested "data" field
                    if isinstance(data, dict) and "data" in data:
                        if isinstance(data["data"], str):
                            return json.loads(data["data"])
                    return data
                else:
                    logger.warning(
                        f"TCP get_state failed ({response.status_code}), falling back"
                    )
                    return await self._get_state_content_provider()
        except Exception as e:
            logger.warning(f"TCP get_state error: {e}, falling back")
            return await self._get_state_content_provider()

    async def _get_state_content_provider(self) -> Dict[str, Any]:
        """Get state via content provider (fallback)."""
        try:
            output = await self.device.shell(
                "content query --uri content://com.droidrun.portal/state_full"
            )
            state_data = self._parse_content_provider_output(output)

            if state_data is None:
                return {
                    "error": "Parse Error",
                    "message": "Failed to parse state data from ContentProvider",
                }

            # Handle nested "data" field if present
            if isinstance(state_data, dict) and "data" in state_data:
                if isinstance(state_data["data"], str):
                    try:
                        return json.loads(state_data["data"])
                    except json.JSONDecodeError:
                        return {
                            "error": "Parse Error",
                            "message": "Failed to parse nested JSON data",
                        }

            return state_data

        except Exception as e:
            return {"error": "ContentProvider Error", "message": str(e)}

    async def input_text(self, text: str, clear: bool = False) -> bool:
        """
        Input text via keyboard.
        Auto-selects TCP or content provider.

        Args:
            text: Text to input
            clear: Whether to clear existing text first

        Returns:
            True if successful, False otherwise
        """
        await self._ensure_connected()
        if self.tcp_available:
            return await self._input_text_tcp(text, clear)
        return await self._input_text_content_provider(text, clear)

    async def _input_text_tcp(self, text: str, clear: bool) -> bool:
        """Input text via TCP."""
        try:
            encoded = base64.b64encode(text.encode()).decode()
            payload = {"base64_text": encoded, "clear": clear}
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.tcp_base_url}/keyboard/input",
                    json=payload,
                    headers={"Content-Type": "application/json"},
                    timeout=10,
                )
                if response.status_code == 200:
                    logger.debug(f"TCP input_text successful")
                    return True
                else:
                    logger.warning(
                        f"TCP input_text failed ({response.status_code}), falling back"
                    )
                    return await self._input_text_content_provider(text, clear)
        except Exception as e:
            logger.warning(f"TCP input_text error: {e}, falling back")
            return await self._input_text_content_provider(text, clear)

    async def _input_text_content_provider(self, text: str, clear: bool) -> bool:
        """Input text via content provider (fallback)."""
        try:
            encoded = base64.b64encode(text.encode()).decode()
            clear_str = "true" if clear else "false"
            cmd = (
                f'content insert --uri "content://com.droidrun.portal/keyboard/input" '
                f'--bind base64_text:s:"{encoded}" '
                f"--bind clear:b:{clear_str}"
            )
            await self.device.shell(cmd)
            logger.debug("Content provider input_text successful")
            return True
        except Exception as e:
            logger.error(f"Content provider input_text error: {e}")
            return False

    async def take_screenshot(self, hide_overlay: bool = True) -> bytes:
        """
        Take screenshot of device.
        Auto-selects TCP or ADB screencap.

        Args:
            hide_overlay: Whether to hide Portal overlay during screenshot

        Returns:
            Screenshot image bytes (PNG format)
        """
        await self._ensure_connected()
        if self.tcp_available:
            return await self._take_screenshot_tcp(hide_overlay)
        return await self._take_screenshot_adb()

    async def _take_screenshot_tcp(self, hide_overlay: bool) -> bytes:
        """Take screenshot via TCP."""
        try:
            url = f"{self.tcp_base_url}/screenshot"
            if not hide_overlay:
                url += "?hideOverlay=false"

            async with httpx.AsyncClient() as client:
                response = await client.get(url, timeout=10.0)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("status") == "success" and "data" in data:
                        logger.debug("Screenshot taken via TCP")
                        return base64.b64decode(data["data"])
                    else:
                        logger.warning(
                            "TCP screenshot failed (invalid response), falling back"
                        )
                        return await self._take_screenshot_adb()
                else:
                    logger.warning(
                        f"TCP screenshot failed ({response.status_code}), falling back"
                    )
                    return await self._take_screenshot_adb()
        except Exception as e:
            logger.warning(f"TCP screenshot error: {e}, falling back")
            return await self._take_screenshot_adb()

    async def _take_screenshot_adb(self) -> bytes:
        """Take screenshot via ADB screencap (fallback)."""
        data = await self.device.screenshot_bytes()
        logger.debug("Screenshot taken via ADB")
        return data

    async def get_apps(self, include_system: bool = True) -> List[Dict[str, str]]:
        """
        Get installed apps with package name and label.

        Note: Currently only supports content provider (no TCP endpoint exists yet)

        Args:
            include_system: Whether to include system apps

        Returns:
            List of dicts with 'package' and 'label' keys
        """
        await self._ensure_connected()
        try:
            logger.debug("Getting apps via content provider")

            # Query content provider
            output = await self.device.shell(
                "content query --uri content://com.droidrun.portal/packages"
            )
            packages_data = self._parse_content_provider_output(output)

            if not packages_data or "packages" not in packages_data:
                logger.warning("No packages data found in content provider response")
                return []

            # Filter and format apps
            apps = []
            for package_info in packages_data["packages"]:
                if not include_system and package_info.get("isSystemApp", False):
                    continue

                apps.append(
                    {
                        "package": package_info.get("packageName", ""),
                        "label": package_info.get("label", ""),
                    }
                )

            logger.debug(f"Found {len(apps)} apps")
            return apps

        except Exception as e:
            logger.error(f"Error getting apps: {e}")
            raise ValueError(f"Error getting apps: {e}") from e

    async def get_version(self) -> str:
        """Get Portal app version."""
        await self._ensure_connected()
        if self.tcp_available:
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.get(
                        f"{self.tcp_base_url}/version", timeout=5.0
                    )
                    if response.status_code == 200:
                        data = response.json()
                        if "data" in data:
                            return data["data"]
                        return data.get("status", "unknown")
            except Exception:
                pass

        # Fallback to content provider
        try:
            output = await self.device.shell(
                "content query --uri content://com.droidrun.portal/version"
            )
            result = self._parse_content_provider_output(output)
            if result and "data" in result:
                return result["data"]
        except Exception:
            pass

        return "unknown"

    async def ping(self) -> Dict[str, Any]:
        """
        Test Portal connection.

        Returns:
            Dictionary with status and connection details
        """
        await self._ensure_connected()
        if self.tcp_available:
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.get(
                        f"{self.tcp_base_url}/ping", timeout=5.0
                    )
                    if response.status_code == 200:
                        try:
                            tcp_response = response.json() if response.content else {}
                            return {
                                "status": "success",
                                "method": "tcp",
                                "url": self.tcp_base_url,
                                "response": tcp_response,
                            }
                        except json.JSONDecodeError:
                            return {
                                "status": "success",
                                "method": "tcp",
                                "url": self.tcp_base_url,
                                "response": response.text,
                            }
                    else:
                        return {
                            "status": "error",
                            "method": "tcp",
                            "message": f"HTTP {response.status_code}: {response.text}",
                        }
            except Exception as e:
                return {"status": "error", "method": "tcp", "message": str(e)}
        else:
            # Test content provider
            try:
                output = await self.device.shell(
                    "content query --uri content://com.droidrun.portal/state"
                )
                if "Row: 0 result=" in output:
                    return {"status": "success", "method": "content_provider"}
                else:
                    return {
                        "status": "error",
                        "method": "content_provider",
                        "message": "Invalid response",
                    }
            except Exception as e:
                return {
                    "status": "error",
                    "method": "content_provider",
                    "message": str(e),
                }
