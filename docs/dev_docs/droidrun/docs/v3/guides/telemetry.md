# Why We Need Telemetry

Telemetry helps us:
- Identify which features are most used and need improvement
- Prioritize bug fixes and new features based on real usage
- Ensure DroidRun works well across different environments

<b>We do not collect any personal or sensitive data.</b> All telemetry is strictly anonymized and used only to improve the framework for everyone.

If you have questions or concerns, please reach out on [GitHub](https://github.com/droidrun/droidrun) or review our privacy policy.

---

# Toggling Telemetry

DroidRun collects <b>anonymized</b> usage data to help us understand which features are most valuable and where improvements are needed. This data is <b>never</b> used for advertising or tracking individuals, and is only used to make DroidRun better for the community.

## How to Disable Telemetry

You can disable telemetry at any time by setting the following environment variable:

```bash
export DROIDRUN_TELEMETRY_ENABLED=false
```

Add this line to your shell profile (e.g., `.bashrc`, `.zshrc`, or `.profile`) to make it persistent across sessions.

## How to Enable Telemetry Again

To re-enable telemetry, set the environment variable to `true`:

```bash
export DROIDRUN_TELEMETRY_ENABLED=true
```

Or simply remove the variable from your environment to use the default (enabled) behavior.
