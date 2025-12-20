# Open Source Engine Stack for Shin-Jadong: A Generative UI Builder Architecture

**Puck + DivKit + BAML emerges as the optimal open-source stack** for building a generative UI system where AI converts user inputs into structured config.json that renders across web and mobile platforms. This architecture is production-validated—Airbnb's Ghost Platform and Yandex's DivKit demonstrate that single-source JSON configurations can power native iOS, Android, and web experiences at massive scale. The approach eliminates app store deployment cycles for UI updates while maintaining truly native performance.

---

## Category 1: JSON-driven web builder engines

The web builder landscape in 2025 offers several mature options, but compatibility with AI-generated configurations varies dramatically. The critical differentiator is whether a framework accepts clean, predictable JSON schemas that LLMs can reliably produce.

| Project | Stars | License | Last Update | JSON AI Score | Self-Hosted | Key Limitation |
|---------|-------|---------|-------------|---------------|-------------|----------------|
| **Puck** | 10.2k | MIT | Dec 2025 | **9/10** | ✅ Full | Younger ecosystem |
| **GrapesJS** | 25.1k | BSD-3 | Dec 2025 | 7/10 | ✅ Full | Outputs HTML, not React |
| **Craft.js** | 8.4k | MIT | Feb 2025 | 8/10 | ✅ Full | Node ID-based schema |
| **Builder.io** | 8.5k | MIT (SDK) | Dec 2025 | 6/10 | ⚠️ Partial | Cloud editor required |
| **Plasmic** | 6.5k | MIT (SDK) | Dec 2025 | 5/10 | ⚠️ Partial | Proprietary format |
| **Unlayer** | 5k | MIT (wrapper) | 2024 | 6/10 | ❌ Cloud | Email-only focus |

### Puck leads with the cleanest AI-compatible schema

Puck's architecture is purpose-built for the generative UI use case. Its JSON schema follows a simple `{ type, props }` structure that maps directly to how LLMs naturally express component configurations:

```json
{
  "content": [
    { "type": "HeroBlock", "props": { "title": "Welcome", "cta": "Get Started" } },
    { "type": "FeatureGrid", "props": { "columns": 3 } }
  ],
  "root": { "props": { "title": "My Page" } }
}
```

The framework separates editing (`<Puck>`) from rendering (`<Render>`), allowing AI-generated JSON to bypass the visual editor entirely. Version 0.4 introduced **Puck AI** with headless generation APIs, signaling explicit support for AI-driven workflows. With **69 active contributors** and MIT licensing, it's the safest choice for commercial applications.

### Craft.js offers maximum customization at added complexity

Craft.js provides a lower-level framework for building custom page editors rather than a ready-made solution. Its JSON uses a node ID-based graph structure that requires slightly more complex AI prompts:

```json
{
  "ROOT": { "type": "Container", "nodes": ["node-1"], "props": {} },
  "node-1": { "type": "Text", "props": { "text": "Hello" }, "parent": "ROOT" }
}
```

This approach offers complete control but adds complexity to the AI generation pipeline. Best suited when building a highly custom editor experience.

### GrapesJS dominates community size but fits less naturally

With **25,000+ stars** and 186 contributors, GrapesJS has the largest ecosystem. However, it outputs HTML/CSS rather than React components, requiring additional transformation layers. The `@grapesjs/react` wrapper enables integration, but the architecture wasn't designed for AI injection. Excellent for email builders or when maximum plugin availability matters more than schema simplicity.

**🏆 One Pick for Category 1: Puck** — Cleanest JSON schema, direct render injection, fully self-hosted, MIT licensed, and actively building AI-first features.

---

## Category 2: Cross-platform app starters for config-driven native

The mobile landscape reveals a fundamental architectural decision: WebView wrapping versus true native rendering from JSON. For a generative UI system, **server-driven UI (SDUI) frameworks** dramatically outperform traditional boilerplates.

| Framework | Stars | Last Update | JSON-UI Score | Cross-Platform | Rendering |
|-----------|-------|-------------|---------------|----------------|-----------|
| **DivKit** | 2.5k | Dec 2025 | **10/10** | iOS/Android/Web | Native |
| **Stac** | ~500 | 2024 | 9/10 | Flutter (all) | Native |
| **Rise Tools** | ~200 | 2024 | 9/10 | React Native | Native |
| **Capacitor** | 12k+ | 2024 | 3/10 | All (WebView) | WebView |
| **Tauri 2.0** | 90k+ | Oct 2024 | 4/10 | All (WebView) | WebView |
| **Ignite CLI** | 19.3k | Oct 2025 | 5/10 | React Native | Native |
| **Obytes** | 3.8k | Jun 2025 | 4/10 | React Native | Native |

### DivKit provides the gold standard for multi-platform JSON rendering

Yandex's DivKit represents the most mature implementation of the config-to-multi-platform vision. A single JSON configuration renders natively on iOS (Swift), Android (Kotlin), and Web (TypeScript) without WebView overhead. The framework powers **Yandex Browser, Search, Music, and Market**—production validation at billions of users scale.

Key capabilities for generative UI:
- **Visual sandbox** for testing configurations before deployment
- **JSON builders** in TypeScript, Kotlin, and Python for programmatic generation
- **Expression API** enabling dynamic content binding
- **Figma plugin** for design-to-code workflows
- **Apache 2.0 license** allowing commercial use

The JSON schema supports complex layouts, animations, and interactive elements:

```json
{
  "card": {
    "log_id": "sample_card",
    "states": [{
      "state_id": 0,
      "div": {
        "type": "container",
        "items": [
          { "type": "text", "text": "Hello World" }
        ]
      }
    }]
  }
}
```

### WebView approaches trade native feel for code sharing simplicity

**Capacitor** and **Tauri 2.0** enable wrapping existing web applications as native apps. For generative UI, this means the same React components rendered on web work identically in mobile apps—zero platform-specific code. Capacitor wraps to iOS/Android; Tauri 2.0 (now stable for mobile) adds desktop targets with Rust backends.

The tradeoff is **60-80% native performance** and platform-inconsistent feel in animations, gestures, and keyboard interactions. For content-heavy apps or MVPs, this may be acceptable. For user-facing products requiring polish, native rendering is worth the investment.

### Stac leads the Flutter ecosystem for SDUI

If choosing Flutter over React, **Stac** (formerly Mirai) offers purpose-built server-driven UI with JSON configuration, theming, and A/B testing without app releases. The ecosystem is smaller than DivKit but growing actively.

**🏆 One Pick for Category 2: DivKit** — Only framework with production-proven native rendering across iOS, Android, and Web from identical JSON configurations.

---

## Category 3: Schema enforcement for reliable LLM outputs

Structured output from LLMs has matured significantly in 2024-2025. The choice depends on your tech stack and reliability requirements—constrained token generation guarantees valid output, while API-based validation offers simpler integration.

| Library | Language | Stars | LLM Providers | Reliability | Error Handling |
|---------|----------|-------|---------------|-------------|----------------|
| **BAML** | Multi | 6.9k | All major | 9/10 | Auto-retry, fallbacks |
| **Instructor** | Python | 12k | 15+ | 9/10 | Tenacity retries |
| **Outlines** | Python | 7.2k | Local/vLLM | 10/10 | Guaranteed valid |
| **Guidance** | Python | 19k | Local/OpenAI | 10/10 | Grammar-based |
| **TypeChat** | TypeScript | 8k+ | OpenAI/Azure | 8/10 | LLM self-repair |
| **Instructor-JS** | TypeScript | Part of org | OpenAI/Anthropic | 8/10 | Retry support |
| **Zod** | TypeScript | 35k+ | Schema only | N/A | Validation layer |

### BAML provides the best multi-language, production-ready solution

BAML (Boundary AI Markup Language) addresses a critical gap: generating type-safe clients for both TypeScript and Python from a single schema definition. For a web-first project with potential Python backend needs, this flexibility is invaluable.

The **Schema-Aligned Parsing (SAP)** algorithm achieves **98% valid outputs** by parsing malformed JSON intelligently rather than requiring perfect LLM compliance. This means fewer retries and lower latency compared to purely validation-based approaches.

```baml
class UIConfig {
  screenType string
  components Component[]
  theme Theme?
}

function GenerateUI(userInput: string) -> UIConfig {
  client anthropic/claude-3-5-sonnet
  prompt #"Generate UI config: {{ userInput }}"#
}
```

BAML works with **all major providers** (OpenAI, Anthropic, Gemini, local models) on day-1 of any model release—no dependency on provider-specific tool-calling features.

### Outlines and Guidance guarantee valid output for local models

If running local models, **Outlines** and **Guidance** use constrained token generation via finite-state machines or grammars. Invalid tokens are mathematically impossible during generation—**0% failure rate** for schema compliance. The tradeoff is limited cloud provider support and more complex infrastructure.

### TypeChat offers the most TypeScript-native experience

Microsoft's TypeChat uses TypeScript interfaces directly as schema specifications, compiling to JSON Schema under the hood. For TypeScript-only projects using OpenAI, it provides the cleanest developer experience with minimal learning curve.

**🏆 One Pick for Category 3: BAML** — Best combination of reliability (98%+), multi-language support, provider flexibility, and production-ready features.

---

## Integration architecture: How Puck + DivKit + BAML work together

The recommended stack creates a unified pipeline from user intent to multi-platform native rendering:

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Input Layer                              │
│  (Multiple-choice questions, free text, uploaded designs)       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BAML Schema Layer                             │
│  - Defines UIConfig, Component, Theme types                     │
│  - LLM generates validated JSON config                          │
│  - 98% first-pass success rate, auto-retry for edge cases       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Unified Config.json                              │
│  {                                                               │
│    "web": { /* Puck-compatible schema */ },                     │
│    "mobile": { /* DivKit-compatible schema */ },                │
│    "metadata": { "version": "1.0", "theme": "light" }           │
│  }                                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Puck Render │  │ DivKit iOS  │  │ DivKit      │
│ (Next.js)   │  │ (Swift)     │  │ Android     │
│             │  │             │  │ (Kotlin)    │
└─────────────┘  └─────────────┘  └─────────────┘
```

### Config schema translation strategy

Puck and DivKit use different JSON structures, requiring a translation layer. The BAML-generated config uses a unified intermediate format:

```typescript
// BAML generates this unified schema
interface UnifiedConfig {
  screens: Screen[];
  theme: ThemeTokens;
  navigation: NavigationConfig;
}

// Translation functions convert to platform-specific formats
const puckConfig = toPuckFormat(unifiedConfig);
const divkitConfig = toDivKitFormat(unifiedConfig);
```

This approach maintains a **single source of truth** while accommodating platform-specific rendering requirements.

---

## Production validation: Companies proving this architecture works

The config-to-multi-platform approach is not theoretical—major companies operate it at scale:

- **Airbnb's Ghost Platform** uses a unified GraphQL schema defining reusable "sections" and "screens" that render natively across web, iOS, and Android. Non-engineers can configure UI without client-side work.

- **Zalando's Appcraft** powers 13 dynamic pages in their mobile app through JSON configurations. Their Flexbox spec translates to UICollectionView (iOS) and Jetpack Compose (Android).

- **Yandex** runs DivKit across Browser, Search, Music, and Market—billions of monthly active users on identical JSON configurations.

The documented benefits in production include **instant updates** (100% user adoption without app stores), **A/B testing** at the screen level, **cross-platform consistency**, and **fast rollback** for problematic configurations.

---

## End-to-end generative UI: Market landscape and opportunities

### Commercial solutions define the current bar

**v0 by Vercel** generates React components with Tailwind CSS from natural language. **Bolt.new** creates full-stack applications using WebContainers for in-browser Node.js execution. **Lovable** (25k apps built daily) produces complete React + Supabase applications from conversational prompts.

All three focus on web-only output. None provide native mobile rendering from the same configuration.

### Open source alternatives gaining traction

- **Dyad** — Local-first v0 alternative supporting any LLM provider
- **Bolt.diy** — Open-source fork of Bolt.new with multi-model support
- **Webcrumbs** — Open-source UI generation from text/images

### The market gap Shin-Jadong can fill

No current tool combines: **AI generation + config-based architecture + true multi-platform native rendering**. The gap exists between web-focused AI builders (v0, Bolt) and enterprise SDUI platforms (DivKit). Bridging "vibe coding" accessibility with production-grade multi-platform output represents a significant opportunity.

---

## Conclusion: Recommended implementation path

The **Puck + DivKit + BAML** stack provides the strongest foundation for Shin-Jadong Launcher. Puck handles web rendering with the cleanest AI-compatible JSON schema. DivKit enables native iOS and Android from the same configuration format. BAML ensures reliable structured output from any major LLM provider.

**Phase 1** should focus on web-only with Puck, validating the AI-to-config pipeline with BAML. **Phase 2** adds DivKit integration for mobile platforms, implementing the schema translation layer. **Phase 3** unifies the developer experience with visual editing tools and deployment automation.

The architecture is production-validated by companies serving billions of users. The open-source licensing (MIT + Apache 2.0) permits commercial use without restrictions. And the AI-first design philosophy aligns with emerging patterns in generative UI—treating interfaces as dynamic artifacts rather than static code.

The technology exists. The production validation exists. The market gap exists. Execution is the remaining variable.