---
name: figma-to-android
description: Generate Jetpack Compose code from Figma designs. Use when user provides a Figma URL and/or screenshot and wants to convert it to Android code using Robin design system components. Also use when user says /figma-to-android. (project)
user-invocable: true
---

# Figma to Code Generator (Android / Jetpack Compose + Robin DS)

This skill converts Figma designs into Jetpack Compose code using the **Robin Design System** (shared via KMP/TSDK). It ensures accurate component matching, proper theming via `RobinTheme`, and correct interactive behaviors.

## When to Use

Activate this skill when:
- User invokes `/figma-to-android`
- User provides a Figma URL and mentions Android or Compose
- User shares a screenshot and asks for Android implementation
- User asks to "convert this design to Android code" or "implement this screen in Compose"

## Required Inputs

**BOTH inputs are required for accurate code generation:**

1. **Figma URL** (REQUIRED): `https://www.figma.com/design/{fileKey}?node-id={nodeId}`
2. **Screenshot** (REQUIRED): Path to a screenshot image of the design

## Instructions

### Step 0: Ask for Required Inputs

**IMPORTANT**: If the user has not provided BOTH a Figma URL AND a screenshot, you MUST ask for them before proceeding.

Use the AskUserQuestion tool to prompt:
```
Questions to ask:
1. "Please provide the Figma URL" (if not provided)
   - Example format: https://www.figma.com/design/ABC123?node-id=123-456
2. "Please provide the screenshot path" (if not provided)
   - User can drag & drop an image or provide a file path
```

**DO NOT proceed to Step 1 until you have BOTH inputs.**

### Step 1: Gather Design Information

**Figma URL** (REQUIRED):
```
Use the mcp__figma__get_design_context tool to fetch design data:
- Extract fileKey from URL
- Extract nodeId from URL (node-id parameter)
```

**Screenshot** (REQUIRED):
```
Use the Read tool to view the screenshot image
- This provides visual context that Figma data may miss
- Use this to verify colors, spacing, and visual hierarchy
```

### Step 2: Read Reference Documentation

**MANDATORY** - Before writing ANY code:

1. Read the Android/KMP UI quick reference:
   ```
   .claude/claude-ui.md
   ```

2. Read the TSDK architecture guide (for screen structure and patterns):
   ```
   tsdk/.claude/claude-architecture.md
   ```

### Step 3: Identify Visual Elements

Create a checklist of ALL visual elements in the design:
- [ ] Navigation bars / headers (toolbar)
- [ ] Text content (titles, subtitles, body, captions)
- [ ] Buttons (primary, secondary, outline, icon, tiny)
- [ ] Icons and their purposes
- [ ] List items / cells with data
- [ ] Cards / containers / surfaces
- [ ] Banners / promotional content
- [ ] Carousels / horizontal scrolling
- [ ] Input fields / search bars
- [ ] Toggles / switches / checkboxes
- [ ] Token / crypto asset icons
- [ ] Loading states / shimmer / skeleton
- [ ] Empty states
- [ ] Tabs / segmented controls
- [ ] Dividers / separators
- [ ] Toasts / snackbars / alerts
- [ ] Bottom sheets / dialogs
- [ ] Badges / chips / labels
- [ ] Progress bars / sliders

### Step 4: Match Components Using Recognition Table

| Figma Element | Robin Component | Notes |
|---|---|---|
| Screen container | `RobinScaffold` | Wrap ALL screens |
| Top bar / header | `RobinToolbar` | 48dp, auto back button |
| Primary filled button | `RobinButton` | 52dp height, full-width |
| Secondary / medium button | `RobinButtonSmall` | 42dp height |
| Compact / tiny button | `RobinButtonTiny` | 32dp height |
| Outline / ghost button | `RobinOutlineButton` | Border style |
| Icon-only button | `RobinIconButton` | 48dp, icon only |
| Text-only clickable | `RobinTextButton` | Leading/trailing icon support |
| Tab navigation | `RobinScrollableTabRow` | Horizontal scrollable tabs |
| Bottom sheet | `RobinBottomSheet` | Modal bottom sheet |
| Row with icon, title, value | `TextValueCell` | Most common list item |
| Basic text row | `TextCell` | Title + optional subtitle |
| Row with image | `TextImageCell` | Text + image area |
| Row with toggle switch | `TextSwitchCell` | Text + switch |
| Row with checkbox | `TextCheckBoxCell` | Text + checkbox |
| Row with checkmark | `TextCheckCell` | Text + check indicator |
| Banner / announcement | `BannerCell` | Icon + text banner |
| Expandable section | `ExpandableTitleCell` | Collapsible content |
| Card with image | `CardImageCell` | Card + image |
| Info display cell | `InfoCell` | Information display |
| Property key-value | `PropertyCell` | Key-value pair |
| Description text | `DescriptionCell` | Description block |
| Horizontal banner carousel | `HorizontalBannerSlide` | Swipeable banners |
| Search input | `RobinSearchBar` | Search field |
| Text input | `RobinTextField` | Input with label |
| Toggle switch | `RobinSwitch` | On/off toggle |
| Range slider | `RobinSlider` | Value slider |
| Divider line | `RobinDivider` | Visual separator |
| Badge / label | `RobinBadge` | Notification badge |
| Tag / chip | `Chip` or `Label` | Label chip |
| Card container | `TwCard` | Card surface |
| Horizontal card | `RobinHorizontalCard` | Horizontal layout card |
| Crypto asset icon | `DefaultAssetImage` | 40dp circular default |
| Async / remote image | `RobinAsyncImage` | Image with loading |
| Image with badge | `RobinBadgedBox` or `RobinBadgeLayout` | Image + overlay badge |
| Loading spinner | `RobinLoader` | Inline spinner |
| Full-screen loading | `RobinLoaderScreen` | Overlay spinner |
| Skeleton text | `ShimmerText` | Skeleton loading |
| Skeleton cell | `AssetSkeleton` | Cell skeleton |
| Snackbar / toast | `RobinSnackBar` | Transient message |
| Alert dialog | `RobinAlertDialog` | Simple alert |
| Info dialog (bottom sheet) | `RobinInfoDialog` | Info + action button |
| Confirmation dialog | `RobinAlternativeDialog` | Two-button dialog |
| Single choice picker | `RobinSingleChoiceDialog` | Selection list |
| Icon toggle button | `RobinIconToggleButton` | Toggleable icon |
| Bottom navigation | `RobinNavigationBottom` | Bottom nav bar |

### Step 5: Verify Icons Exist

**CRITICAL** - Before using any icon:

1. Check icon category objects at `tsdk/design-system/src/commonMain/kotlin/com/trustwallet/sdk/feature/ui/icons/`

2. Available icon sets:
   - `CommonIcons` - General UI (arrowBack, arrowDown, arrowRight, close, copy, etc.)
   - `BinanceIcons` - Binance-specific (Notifications, QR, SettingsOutlined, etc.)
   - `SettingsIcons` - Settings page (DarkMode, AddressBook, Security, etc.)
   - `HomeIcons` - Home screen icons
   - `BannerIcons` - Banner/alert icons
   - `EarnIcons` - Earn feature icons
   - `PaymentIcons` - Payment icons
   - `DAppIcons` - DApp browser icons
   - `BrandIcons` - Brand identity icons
   - `NetworkIcons` - Blockchain network icons
   - `VipIcons` - VIP/Premium icons

3. Icon usage pattern:
   ```kotlin
   Icon(
       imageVector = CommonIcons.arrowBack(),
       contentDescription = null,
       tint = RobinTheme.colorScheme.IconPrimary
   )
   ```

4. For standard item icons in cells:
   ```kotlin
   DefaultItemIcon(vector = CommonIcons.someIcon())
   DefaultTinyItemIcon(vector = CommonIcons.someIcon())
   ```

**Common verified icons:**

| Action | Icon | Set |
|---|---|---|
| Back | `CommonIcons.arrowBack()` | CommonIcons |
| Forward / Next | `CommonIcons.ArrowRight` | CommonIcons |
| Down arrow | `CommonIcons.ArrowDown` | CommonIcons |
| Close | `CommonIcons.BannerClose` | CommonIcons |
| Copy | `CommonIcons.Copy` | CommonIcons |
| Settings | `BinanceIcons.SettingsOutlined` or `BinanceIcons.SettingsSolid` | BinanceIcons |
| Notifications | `BinanceIcons.Notifications` | BinanceIcons |
| QR Code | `BinanceIcons.QR` | BinanceIcons |
| Search | Search via `RobinToolbar(onSearch = ...)` or `RobinSearchBar` | N/A |

**If an icon is not found:** Search the `/icons/` subdirectories for similar names. Use `QuestionSolid` as a last-resort placeholder. **DO NOT generate custom icons.**

### Step 6: Read Component Source Files

For EACH matched component, read its Kotlin source to understand the API:

**Robin components:**
```
tsdk/design-system/src/commonMain/kotlin/com/trustwallet/sdk/feature/ui/robin/component/{ComponentName}.kt
```

**Cell components:**
```
tsdk/design-system/src/commonMain/kotlin/com/trustwallet/sdk/feature/ui/cells/{CellName}.kt
```

**Dialog components:**
```
tsdk/design-system/src/commonMain/kotlin/com/trustwallet/sdk/feature/ui/dialog/{DialogName}.kt
```

Read the `.kt` source directly to understand:
- `@Composable` function parameters and their types
- Required vs optional parameters with defaults
- Available style/color configurations
- Content slot lambdas

### Step 7: Implement Interactive Behaviors

**Screen structure MUST use RobinScaffold + RobinToolbar:**
```kotlin
@Composable
fun FeatureScreen(
    onNavigateUp: () -> Unit,
) {
    RobinScaffold(
        topBar = {
            RobinToolbar(
                title = "Screen Title",
                onNavigateUp = onNavigateUp,
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(paddingValues)
        ) {
            // Content
        }
    }
}
```

**Tabs MUST use RobinScrollableTabRow:**
```kotlin
RobinScrollableTabRow(
    selectedTabIndex = selectedTab,
    tabs = listOf("Tab 1", "Tab 2", "Tab 3"),
    onTabSelected = { index -> selectedTab = index }
)
```

**List items MUST use Cell components:**
```kotlin
TextValueCell(
    title = "Asset Name",
    subtitle = "BTC",
    value = "$65,000",
    valueDescription = buildAnnotatedString {
        withStyle(SpanStyle(color = RobinTheme.colorScheme.Success1)) {
            append("+2.5%")
        }
    },
    image = {
        DefaultAssetImage(
            iconUrl = iconUrl,
            iconPreviewText = "BTC",
            size = 40.dp
        )
    },
    onClick = { handleClick() }
)
```

**Buttons MUST use Robin variants:**
```kotlin
// Primary action
RobinButton(
    title = "Continue",
    onClick = { handleAction() },
    enabled = true,
    loading = false,
)

// Secondary
RobinButtonSmall(
    title = "Cancel",
    onClick = { handleCancel() },
    colors = RobinButtonDefaults.secondaryButtonColors(),
)

// Icon button in toolbar
RobinIconButton(onClick = { onAction() }) {
    Icon(
        imageVector = BinanceIcons.SettingsSolid,
        contentDescription = null,
        tint = RobinTheme.colorScheme.IconPrimary
    )
}
```

**Dialogs MUST use Robin dialog components:**
```kotlin
RobinInfoDialog(
    icon = { Icon(imageVector = icon, contentDescription = null) },
    title = "Title",
    message = "Description text",
    action = "OK",
    onAction = { handleAction() },
    onDismiss = { handleDismiss() },
)
```

### Step 8: Use Theme Tokens

**REQUIRED** - All styling must use `RobinTheme` tokens:

```kotlin
// Colors
RobinTheme.colorScheme.NewTextPrimary       // Primary text
RobinTheme.colorScheme.NewTextSecondary      // Secondary text
RobinTheme.colorScheme.BackgroundPrimary     // Primary background
RobinTheme.colorScheme.BackgroundSecondary   // Secondary background
RobinTheme.colorScheme.BrandPrimary          // Brand accent
RobinTheme.colorScheme.ButtonPrimary         // Button fill
RobinTheme.colorScheme.IconPrimary           // Icon primary
RobinTheme.colorScheme.IconSecondary         // Icon secondary
RobinTheme.colorScheme.LineDivider           // Divider color
RobinTheme.colorScheme.SuccessMain           // Success green
RobinTheme.colorScheme.ErrorMain             // Error red
RobinTheme.colorScheme.WarningMain           // Warning yellow
RobinTheme.colorScheme.InputSearchBg         // Search background

// Typography (call as functions)
RobinTheme.typography.header32()             // Bold 32pt header
RobinTheme.typography.header24()             // Bold 24pt header
RobinTheme.typography.header20()             // Bold 20pt header
RobinTheme.typography.subHeader16()          // Semibold 16pt
RobinTheme.typography.subHeader14()          // Semibold 14pt
RobinTheme.typography.body16()               // Regular 16pt body
RobinTheme.typography.body14()               // Regular 14pt body
RobinTheme.typography.body12()               // Regular 12pt body
RobinTheme.typography.caption12()            // Medium 12pt caption
RobinTheme.typography.caption10()            // Medium 10pt caption

// Spacing (use .dp via padding object)
RobinTheme.padding.small                     // 8dp
RobinTheme.padding.smallMedium               // 12dp
RobinTheme.padding.medium                    // 16dp
RobinTheme.padding.mediumLarge               // 24dp
RobinTheme.padding.large                     // 32dp
RobinTheme.padding.xLarge                    // 40dp
RobinTheme.padding.xxLarge                   // 48dp

// Shapes
RobinTheme.shapes.extraSmall                 // 4dp corners
RobinTheme.shapes.small                      // 8dp corners
RobinTheme.shapes.medium                     // 12dp corners
RobinTheme.shapes.large                      // 16dp corners
RobinTheme.shapes.extraLarge                 // 48dp corners
```

**Anti-patterns:**
```kotlin
// WRONG - hardcoded values
Text(
    text = "Hello",
    color = Color(0xFF0000FF),
    fontSize = 16.sp
)
Modifier.padding(16.dp)
Modifier.background(Color.White)

// CORRECT - theme tokens
Text(
    text = "Hello",
    style = RobinTheme.typography.body16(),
    color = RobinTheme.colorScheme.NewTextPrimary
)
Modifier.padding(RobinTheme.padding.medium.dp)
Modifier.background(RobinTheme.colorScheme.BackgroundPrimary)
```

### Step 9: Write Code to File

**CRITICAL: You MUST write the generated code directly to a file using the Write tool. NEVER output code to chat.**

1. **Determine the file path:**
   - Ask the user where to place the file if not specified
   - Typical location: `android/features/{feature}/src/main/kotlin/com/wallet/crypto/trustapp/features/{feature}/{ScreenName}Screen.kt`
   - Derive name from Figma design (e.g., "Wallet Home" → `WalletHomeScreen.kt`)

2. **Use the Write tool immediately** to create the file with the complete implementation

**Code structure to write:**

```kotlin
package com.wallet.crypto.trustapp.features.{feature}

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
// Robin DS imports
import com.trustwallet.sdk.feature.ui.robin.RobinTheme
import com.trustwallet.sdk.feature.ui.robin.component.RobinScaffold
import com.trustwallet.sdk.feature.ui.robin.component.RobinToolbar
// Add other component imports as needed

@Composable
fun ScreenNameScreen(
    onNavigateUp: () -> Unit,
) {
    RobinScaffold(
        topBar = {
            RobinToolbar(
                title = "Screen Title",
                onNavigateUp = onNavigateUp,
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(paddingValues)
        ) {
            // Screen content using Robin DS components
        }
    }
}
```

## Verification Checklist

Before writing to file, verify:

### Component Usage
- [ ] Every visual element uses a Robin DS component
- [ ] No custom `Row { Icon(); Column { Text(); Text() } }` for list items (use Cell components)
- [ ] No custom `Row { Icon(); Text(); Icon() }` for toolbars (use `RobinToolbar`)
- [ ] No custom button composables (use `RobinButton`, `RobinButtonSmall`, etc.)
- [ ] Screen wrapped in `RobinScaffold` + `RobinToolbar`

### Icon Verification
- [ ] All icons verified in icon category objects (`CommonIcons`, `BinanceIcons`, etc.)
- [ ] Icons use `Icon(imageVector = CategoryIcons.iconName(), ...)`
- [ ] No assumed icon names - every icon searched and confirmed
- [ ] No custom/generated icons

### Theme Usage
- [ ] All colors use `RobinTheme.colorScheme.*` (no hardcoded hex/Color.*)
- [ ] All spacing uses `RobinTheme.padding.*` (no raw `.dp` values for standard spacing)
- [ ] All text styles use `RobinTheme.typography.*()` (no `.sp` or custom TextStyle)
- [ ] All shapes use `RobinTheme.shapes.*` (no hardcoded RoundedCornerShape)

### Props Accuracy
- [ ] Button colors match design (primary, secondary, buy, sell)
- [ ] Cell component type matches layout (TextValueCell vs TextCell vs TextImageCell)
- [ ] Dialog type matches intent (info, alternative, alert)

### Interactive Behavior
- [ ] Tabs use `RobinScrollableTabRow` with state binding
- [ ] Bottom sheets use `RobinBottomSheet`
- [ ] Switches bind to state
- [ ] Click handlers connected
- [ ] Navigation callbacks wired

### Imports
- [ ] Robin DS components from `com.trustwallet.sdk.feature.ui.*`
- [ ] Compose foundation/material imports as needed
- [ ] No unused imports

## Output Format

**IMPORTANT: Do NOT output code to chat. Write directly to files.**

After writing the file(s), provide a brief summary:
1. **File created**: Path to the generated screen file
2. **Components used**: List of Robin DS components used
3. **Notes**: Any assumptions, missing icons, or components not found

## Example Workflow

### Example 1: User provides both inputs
User: "Here's the Figma URL: https://www.figma.com/design/ABC123?node-id=123-456 and screenshot at /path/to/screenshot.png - implement for Android"

1. Fetch Figma data using `mcp__figma__get_design_context`
2. View screenshot using `Read` tool
3. Read `.claude/claude-ui.md`
4. Identify elements: Toolbar, tabs, asset list cells, action buttons
5. Read component sources: `RobinToolbar.kt`, `RobinScrollableTabRow.kt`, `TextValueCell.kt`, `RobinButton.kt`
6. Verify icons in `/icons/` directory
7. **Write code to file using Write tool** (e.g., `WalletHomeScreen.kt`)
8. Provide brief summary

### Example 2: User invokes skill without inputs
User: "/figma-to-android"

1. **ASK FOR INPUTS** using AskUserQuestion:
   - Question 1: "What is the Figma URL for the design you want to convert?"
   - Question 2: "Please provide a screenshot of the design (drag & drop or file path)"
2. Wait for user to provide both inputs
3. Proceed with steps 1-8 from Example 1

### Example 3: User provides only one input
User: "Convert this to Android: https://www.figma.com/design/ABC123?node-id=123-456"

1. **ASK FOR MISSING INPUT** using AskUserQuestion:
   - "Please also provide a screenshot of the design for accurate code generation"
2. Wait for screenshot
3. Proceed with full workflow

## Critical Rules

- **NEVER output code to chat** - always use Write tool to create files
- NEVER improvise components - use only Robin DS components
- ALWAYS read component source files before coding
- ALWAYS verify icons exist before using them
- ALWAYS use `RobinTheme.*` for colors, typography, spacing, and shapes
- NEVER hardcode colors, spacing, fonts, or sizes
- ALWAYS wrap screens in `RobinScaffold` + `RobinToolbar`
- ALWAYS use Cell components for list items (never custom Row layouts)
- Interactive elements must have full behavior, not just visuals
