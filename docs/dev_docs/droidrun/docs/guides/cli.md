---
title: 'CLI 사용법'
description: '자연어로 기기를 제어하는 명령줄 인터페이스'
---

## 개요

Droidrun CLI를 사용하면 LLM 에이전트로 구동되는 자연어 명령으로 Android 및 iOS 기기를 제어할 수 있습니다.

### 빠른 시작

```bash
# 기기 설정
droidrun setup

# 명령 실행 (단축형 - "run" 불필요)
droidrun "Spotify를 열고 내 Discover Weekly 재생"

# 또는 명시적
droidrun run "방해 금지 모드 켜기"
```

<Note>
**자동 구성**: `config.yaml`이 존재하지 않으면 Droidrun이 `config_example.yaml`에서 자동으로 생성합니다.

**명령 단축**: `droidrun "task"`는 `droidrun run "task"`와 동일합니다.
</Note>

---

## 명령어

<Tabs>
  <Tab title="run">

기기에서 자연어 명령을 실행합니다.

### 사용법

```bash
droidrun run "<command>" [OPTIONS]

# 단축형 ("run" 생략)
droidrun "<command>" [OPTIONS]
```

### 일반 플래그

| 플래그 | 설명 | 기본값 |
|--------|------|--------|
| `--provider`, `-p` | LLM 제공업체 (GoogleGenAI, OpenAI, Anthropic 등) | 구성에서 |
| `--model`, `-m` | 모델 이름 | 구성에서 |
| `--device`, `-d` | 기기 시리얼 또는 IP | 자동 감지 |
| `--steps` | 최대 실행 단계 | `15` |
| `--reasoning` | 계획 모드 활성화 | `false` |
| `--vision` | 모든 에이전트에 비전 활성화 | 구성에서 |
| `--tcp` | 콘텐츠 제공업체 대신 TCP 사용 | `false` |
| `--debug` | 자세한 로깅 | `false` |
| `--save-trajectory` | 실행 저장 (`none`, `step`, `action`) | `none` |
| `--config`, `-c` | 커스텀 구성 경로 | `config.yaml` |

### 예제

<Tabs>
  <Tab title="기본">
```bash
# 간단한 명령
droidrun "설정 열기"

# 다단계 작업
droidrun "John에게 WhatsApp으로 보내기: 늦을게"

# 특정 기기
droidrun "배터리 확인" --device emulator-5554
```
  </Tab>

  <Tab title="LLM 제공업체">
```bash
# Google Gemini
export GOOGLE_API_KEY=your-key
droidrun "오래된 이메일 보관" \
  --provider GoogleGenAI \
  --model models/gemini-2.5-flash

# OpenAI
export OPENAI_API_KEY=your-key
droidrun "쇼핑 목록 만들기" \
  --provider OpenAI \
  --model gpt-4o

# Anthropic Claude
export ANTHROPIC_API_KEY=your-key
droidrun "최신 이메일에 답장" \
  --provider Anthropic \
  --model claude-sonnet-4-5-latest

# 로컬 Ollama (무료)
droidrun "다크 모드 켜기" \
  --provider Ollama \
  --model llama3.3:70b \
  --base_url http://localhost:11434
```
  </Tab>

  <Tab title="Advanced">
```bash
# Complex task with planning
droidrun "Organize inbox by sender" \
  --reasoning \
  --vision \
  --steps 30

# Debug failing command
droidrun "Book Uber to airport" \
  --debug \
  --save-trajectory action

# Wireless execution
droidrun "Clear cache" \
  --device 192.168.1.100:5555 \
  --tcp

# Custom config
droidrun "Enable 2FA" \
  --config /path/to/config.yaml
```
  </Tab>
</Tabs>

### Provider Options

| Provider | Install | Environment Variable |
|----------|---------|---------------------|
| GoogleGenAI | `uv pip install 'droidrun[google]'` | `GOOGLE_API_KEY` |
| OpenAI | `uv pip install 'droidrun[openai]'` | `OPENAI_API_KEY` |
| Anthropic | `uv pip install 'droidrun[anthropic]'` | `ANTHROPIC_API_KEY` |
| DeepSeek | `uv pip install 'droidrun[deepseek]'` | `DEEPSEEK_API_KEY` |
| Ollama | `uv pip install 'droidrun[ollama]'` | None (local) |

  </Tab>

  <Tab title="Device Management">

### `droidrun devices`

List connected devices.

```bash
droidrun devices
# Output:
# Found 2 connected device(s):
#   • emulator-5554
#   • 192.168.1.100:5555
```

---

### `droidrun setup`

Install Portal APK on device.

```bash
# Auto-detect device
droidrun setup

# Specific device
droidrun setup --device emulator-5554

# Custom APK
droidrun setup --path /path/to/portal.apk
```

**What it does:**
1. Downloads latest Portal APK
2. Installs with all permissions
3. Auto-enables accessibility service
4. Opens settings if manual enable needed

---

### `droidrun ping`

Test Portal connection.

```bash
# Test default communication
droidrun ping

# Test TCP mode
droidrun ping --tcp

# Specific device
droidrun ping --device 192.168.1.100:5555
```

**Success output:** `Portal is installed and accessible. You're good to go!`

---

### `droidrun connect`

Connect to device via TCP/IP.

```bash
droidrun connect 192.168.1.100:5555
```

**Prerequisites:**
```bash
# Enable wireless debugging (Android 11+)
# Settings > Developer options > Wireless debugging

# Or via USB:
adb tcpip 5555
adb shell ip route | awk '{print $9}'  # Get IP
droidrun connect <IP>:5555
```

---

### `droidrun disconnect`

Disconnect from device.

```bash
droidrun disconnect 192.168.1.100:5555
```

  </Tab>

  <Tab title="Macros">

Record and replay automation sequences.

### `droidrun macro list`

List saved trajectories.

```bash
# Default directory
droidrun macro list

# Custom directory
droidrun macro list /path/to/trajectories
```

**Output:**
```
Found 3 trajectory(s):

┏━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━┓
┃ Folder           ┃ Description               ┃ Actions ┃
┡━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━┩
│ open-settings    │ Opens settings app        │ 3       │
│ enable-dark-mode │ Navigate to display...    │ 8       │
└──────────────────┴───────────────────────────┴─────────┘
```

---

### `droidrun macro replay`

Replay recorded macro.

```bash
# Basic replay
droidrun macro replay trajectories/open-settings

# Custom device and timing
droidrun macro replay trajectories/login-flow \
  --device emulator-5554 \
  --delay 0.5

# Start from specific step
droidrun macro replay trajectories/checkout \
  --start-from 5 \
  --max-steps 10

# Preview without executing
droidrun macro replay trajectories/test --dry-run
```

**Flags:**

| Flag | Description | Default |
|------|-------------|---------|
| `--device`, `-d` | Device serial | Auto-detect |
| `--delay`, `-t` | Seconds between actions | `1.0` |
| `--start-from`, `-s` | Start step (1-based) | `1` |
| `--max-steps`, `-m` | Max steps to run | All |
| `--dry-run` | Preview only | `false` |

---

### Recording Trajectories

```bash
# Record at action level (most detailed)
droidrun "Create alarm for 7am" --save-trajectory action

# Record at step level
droidrun "Export contacts" --save-trajectory step
```

**Trajectory structure:**
```
trajectories/2025-10-16_14-30-45/
├── macro.json       # Action sequence
├── step_0.png       # Screenshots
├── step_1.png
└── ...
```

  </Tab>
</Tabs>

---

## Configuration

### Override Priority

1. **CLI flags** (highest)
2. **Config file** (`config.yaml`)
3. **Defaults** (lowest)

### Common Patterns

<CodeGroup>

```bash Quick Test
droidrun "Turn on dark mode" \
  --provider GoogleGenAI \
  --model models/gemini-2.5-flash
```

```bash Debug Task
droidrun "Book ride to airport" \
  --debug \
  --reasoning \
  --vision \
  --save-trajectory action
```

```bash Cost Optimization
droidrun "Set alarm" \
  --provider GoogleGenAI \
  --model models/gemini-2.5-flash \
  --no-vision
```

```bash Multiple Devices
for device in $(adb devices | awk 'NR>1 {print $1}'); do
  droidrun "Clear notifications" --device $device
done
```

</CodeGroup>

---

## Troubleshooting

<AccordionGroup>
  <Accordion title="No devices found">
```bash
# Check ADB
adb devices

# If unauthorized: Accept prompt on device
# If not listed: Try different USB port/cable
# Restart ADB
adb kill-server && adb start-server
```
  </Accordion>

  <Accordion title="Portal not accessible">
```bash
# Verify installation
adb shell pm list packages | grep droidrun

# Reinstall
droidrun setup

# Enable accessibility manually
adb shell settings put secure enabled_accessibility_services \
  com.droidrun.portal/.DroidrunAccessibilityService
```
  </Accordion>

  <Accordion title="LLM provider errors">
```bash
# Install provider
uv pip install 'droidrun[google,openai,anthropic]'

# Check API key
echo $GOOGLE_API_KEY

# Set if missing
export GOOGLE_API_KEY=your-key
```
  </Accordion>

  <Accordion title="Command times out">
```bash
# Increase steps
droidrun "Complex task" --steps 50

# Enable debug mode
droidrun "Task" --debug

# Try reasoning mode
droidrun "Multi-step task" --reasoning
```
  </Accordion>

  <Accordion title="TCP connection fails">
```bash
# Enable TCP mode (USB connected first)
adb tcpip 5555

# Get device IP
adb shell ip route | awk '{print $9}'

# Connect
droidrun connect <IP>:5555

# Verify
droidrun ping --tcp
```
  </Accordion>
</AccordionGroup>

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Google Gemini API key | None |
| `OPENAI_API_KEY` | OpenAI API key | None |
| `ANTHROPIC_API_KEY` | Anthropic API key | None |
| `DEEPSEEK_API_KEY` | DeepSeek API key | None |
| `DROIDRUN_CONFIG` | Config file path | `config.yaml` |

**Setting variables:**

<CodeGroup>

```bash Linux/macOS
export GOOGLE_API_KEY=your-key
```

```bash Windows PowerShell
$env:GOOGLE_API_KEY="your-key"
```

```bash Permanent (Linux/macOS)
echo 'export GOOGLE_API_KEY=your-key' >> ~/.bashrc
source ~/.bashrc
```

</CodeGroup>

---

## Next Steps

- [Configuration Guide](/sdk/configuration) - Customize behavior
- [Device Setup](/guides/device-setup) - Detailed setup instructions
- [Agent Architecture](/concepts/architecture) - How it works
- [Custom Tools](/features/custom-tools) - Extend functionality
