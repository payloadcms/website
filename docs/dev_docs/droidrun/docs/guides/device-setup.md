---
title: 'Device Setup'
description: 'Setting up Android and iOS devices for Droidrun automation'
---

## Overview

Droidrun controls devices through a specialized Portal app that bridges your computer and the device.

<Tabs>
  <Tab title="Android Setup">

## Prerequisites

<Steps>
  <Step title="Install ADB">
    **macOS**: `brew install android-platform-tools`

    **Linux**: `sudo apt install adb`

    **Windows**: Download from [Android Developer Site](https://developer.android.com/studio/releases/platform-tools)

    Verify: `adb version`
  </Step>

  <Step title="Enable USB Debugging">
    1. Go to **Settings** > **About phone**
    2. Tap **Build number** 7 times (enables Developer options)
    3. Go to **Settings** > **Developer options**
    4. Enable **USB debugging**
    5. Connect device and tap **Always allow**

    Verify: `adb devices`
  </Step>

  <Step title="Install Portal App">
    ```bash
    # Automatic setup (downloads latest Portal APK)
    droidrun setup

    # Or specify device
    droidrun setup --device SERIAL_NUMBER
    ```

    This will:
    - Download the latest Portal APK
    - Install with all permissions granted
    - Enable accessibility service automatically
  </Step>

  <Step title="Verify Setup">
    ```bash
    droidrun ping
    # Output: Portal is installed and accessible. You're good to go!
    ```
  </Step>
</Steps>

---

## Portal App

The Droidrun Portal (`com.droidrun.portal`) provides:

- **Accessibility Tree** - Extracts UI elements and their properties
- **Device State** - Tracks current activity, keyboard visibility
- **Action Execution** - Tap, swipe, text input, and other actions
- **Dual Communication** - TCP (faster) or Content Provider (fallback)

<Note>
The Portal only communicates locally via ADB. No data is sent to external servers.
</Note>

---

## Communication Modes

<AccordionGroup>
  <Accordion title="TCP Mode (Recommended) - per operation">
    **How it works:**
    - Portal runs HTTP server on device port 8080
    - ADB forwards local port → device port 8080
    - Droidrun sends HTTP requests to `localhost:PORT`

    **Enable:**
    ```bash
    # CLI
    droidrun run "your command" --tcp

    # Python
    tools = DeviceConfig(serial="DEVICE_SERIAL", use_tcp=True)
    ```

    **Troubleshooting:**
    ```bash
    # Check port forwarding
    adb forward --list

    # Test Portal server
    adb shell netstat -an | grep 8080

    # Remove all forwards and retry
    adb forward --remove-all
    droidrun ping --tcp
    ```
  </Accordion>

  <Accordion title="Content Provider (Fallback) - per operation">
    **How it works:**
    - Portal exposes content provider at `content://com.droidrun.portal/`
    - Commands sent via ADB shell: `content query --uri ...`
    - JSON responses parsed from shell output

    **Usage:**
    ```bash
    # Default mode (no flag needed)
    droidrun ping

    # Python
    tools = DeviceConfig(serial="DEVICE_SERIAL", use_tcp=False)
    ```

    **Troubleshooting:**
    ```bash
    # Test content provider directly
    adb shell content query --uri content://com.droidrun.portal/state

    # Should show: Row: 0 result={"data": "{...}"}
    ```
  </Accordion>
</AccordionGroup>

---

## Advanced Setup

<AccordionGroup>
  <Accordion title="Wireless Debugging (Android 11+)">
    ### Setup

    <Steps>
      <Step title="Enable Wireless Debugging">
        1. **Settings** > **Developer options** > **Wireless debugging**
        2. Note IP address and port (e.g., `192.168.1.100:37757`)
      </Step>

      <Step title="Pair Device (First Time)">
        **QR Code Method:**
        ```bash
        adb pair <QR_CODE_STRING>
        ```

        **Pairing Code Method:**
        1. Tap **Pair device with pairing code**
        2. Note pairing code and IP:port
        3. Run: `adb pair IP:PORT`
        4. Enter pairing code
      </Step>

      <Step title="Connect">
        ```bash
        adb connect IP:PORT
        droidrun ping --device IP:PORT
        ```
      </Step>
    </Steps>

    ### Common Issues

    - Connection refused → Check same WiFi network and firewall
    - Frequent drops → Use 5GHz WiFi or stay near router
    - Can't find IP → Run `adb shell ip addr show wlan0 | grep "inet "` via USB
  </Accordion>

  <Accordion title="Wireless Debugging (Android 10 and Below)">
    <Steps>
      <Step title="Enable TCP/IP Mode (USB Required)">
        ```bash
        # Connect via USB first
        adb tcpip 5555
        ```
      </Step>

      <Step title="Find Device IP">
        ```bash
        adb shell ip addr show wlan0 | grep inet
        ```
      </Step>

      <Step title="Connect Wirelessly">
        ```bash
        # Disconnect USB cable
        adb connect DEVICE_IP:5555
        droidrun ping --device DEVICE_IP:5555
        ```
      </Step>
    </Steps>
  </Accordion>

  <Accordion title="Multiple Devices">
    ### List Devices

    ```bash
    droidrun devices
    # Found 2 connected device(s):
    #   • emulator-5554
    #   • 192.168.1.100:5555
    ```

    ### Target Specific Device

    ```bash
    # CLI
    droidrun run "your command" --device emulator-5554

    # Python
    tools = DeviceConfig(serial="emulator-5554")
    agent = DroidAgent(goal="your task", tools=tools)
    ```

    ### Parallel Control

    ```python
    import asyncio
    from droidrun import DeviceConfig, DroidrunConfig, DroidAgent
    from adbutils import adb

    async def control_device(serial: str, command: str):
        device_config = DeviceConfig(serial=serial)
        config = DroidrunConfig(device=device_config)
        agent = DroidAgent(goal=command, config=config)
        return await agent.run()

    async def main():
        devices = adb.list()

        tasks = [
            control_device(devices[0].serial, "Open settings"),
            control_device(devices[1].serial, "Check battery"),
        ]

        results = await asyncio.gather(*tasks)
        print(results)

    asyncio.run(main())
    ```
  </Accordion>
</AccordionGroup>

---

## Troubleshooting

<AccordionGroup>
  <Accordion title="Device not found">
    **Symptoms:** `adb devices` shows no devices or `unauthorized`

    **Solutions:**
    1. Unplug/replug USB cable, try different port
    2. Revoke USB debugging authorizations (Developer options)
    3. Reconnect and tap "Always allow"
    4. Restart ADB: `adb kill-server && adb start-server`
    5. **Windows**: Install [Google USB Driver](https://developer.android.com/studio/run/win-usb)
  </Accordion>

  <Accordion title="Portal not installed">
    **Symptoms:** `droidrun ping` fails with "Portal is not installed"

    **Solutions:**
    1. Reinstall: `droidrun setup`
    2. Check: `adb shell pm list packages | grep droidrun`
    3. Verify APK architecture matches device (arm64-v8a for most devices)
  </Accordion>

  <Accordion title="Accessibility service not enabled">
    **Symptoms:** `droidrun ping` fails with "accessibility service not enabled"

    **Solutions:**
    1. Auto-enable:
       ```bash
       adb shell settings put secure enabled_accessibility_services \
         com.droidrun.portal/com.droidrun.portal.DroidrunAccessibilityService
       adb shell settings put secure accessibility_enabled 1
       ```
    2. Manual: Settings > Accessibility > Droidrun Portal > Toggle ON
    3. Verify:
       ```bash
       adb shell settings get secure enabled_accessibility_services
       # Should contain: com.droidrun.portal/...
       ```
  </Accordion>

  <Accordion title="Text input not working">
    **Symptoms:** `input_text()` fails or types gibberish

    **Solutions:**
    1. Keyboard auto-enabled by `AdbTools.__init__()`:
       ```bash
       # Verify
       adb shell settings get secure default_input_method
       # Should show: com.droidrun.portal/.DroidrunKeyboardIME
       ```
    2. Manual switch: Long press space bar → Select "Droidrun Keyboard"
    3. Focus element first: `tools.tap_by_index(5)` then `tools.input_text("text")`
  </Accordion>

  <Accordion title="Empty UI state">
    **Symptoms:** `get_state()` returns empty or incomplete UI tree

    **Solutions:**
    1. Verify accessibility: `droidrun ping`
    2. Some apps block accessibility services (WebViews, games, custom UI)
    3. Wait for UI: `time.sleep(1)` after tap/swipe
    4. Enable Portal overlay to see detected elements
  </Accordion>
</AccordionGroup>

  </Tab>

  <Tab title="iOS Setup (experimental)">

<Warning>
iOS support is currently **experimental**. Functionality is limited compared to Android.
</Warning>

---

## Prerequisites

- **macOS** with Xcode installed
- **iOS device** with Developer mode enabled
- **iOS Portal app** (separate from Android Portal)

---

## Setup

<Steps>
  <Step title="Install iOS Portal">
    The iOS Portal app must be manually installed on your device.

    <Note>
    Installation instructions and download link coming soon.
    </Note>
  </Step>

  <Step title="Get Device IP">
    Find your iOS device's IP address in Settings > WiFi > (i) icon
  </Step>

  <Step title="Test Connection">
    ```python
    from droidrun import IOSTools

    tools = IOSTools(url="http://DEVICE_IP:8080")
    result = tools.ping()
    print(result)
    ```
  </Step>
</Steps>

---

## Architecture

iOS Portal uses a different architecture than Android:

| Feature | Android | iOS |
|---------|---------|-----|
| Communication | ADB + TCP/Content Provider | HTTP server only |
| Setup Tool | `droidrun setup` | Manual installation |
| Accessibility | Android Accessibility API | iOS Accessibility API |
| Text Input | Custom keyboard IME | Direct text input |

---

## Usage

### Python API

```python
from droidrun import IOSTools, DroidAgent

# Initialize iOS tools with device URL
tools = IOSTools(
    url="http://192.168.1.100:8080",
    bundle_identifiers=["com.example.app"]  # Optional
)

# Create agent
agent = DroidAgent(
    goal="Open Settings and check WiFi",
    tools=tools
)

result = await agent.run()
```

### CLI

```bash
# Use --ios flag
droidrun run "your command" --ios

# Or set platform in config.yaml:
# device:
#   platform: ios
```

---

## Limitations

Current iOS support has these limitations:

| Feature | Status | Notes |
|---------|--------|-------|
| `get_date()` | ❌ | Returns "Not implemented for iOS" |
| `back()` | ❌ | Raises `NotImplementedError` |
| `drag()` | ❌ | Not implemented, returns False |
| `get_apps()` | ⚠️ | Use `list_packages()` instead |
| `input_text()` | ⚠️ | No `index` or `clear` parameters |
| `tap()`, `swipe()` | ✅ | Fully supported |
| `get_state()` | ✅ | Returns accessibility tree |
| `take_screenshot()` | ✅ | Fully supported |

  </Tab>
</Tabs>

---

## Next Steps

- Learn about the [Agent System](/concepts/architecture)
- Explore [Configuration Options](/sdk/configuration)
- Try [Custom Tools](/features/custom-tools)
- Implement [Structured Output](/features/structured-output)
