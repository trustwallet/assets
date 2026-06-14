---
name: figma-to-ios
description: Generate SwiftUI code from Figma designs. Use when user provides a Figma URL and/or screenshot and wants to convert it to iOS code using TDSKit components. Also use when user says /figma-to-ios. (project)
user-invocable: true
---

# Figma to Code Generator (iOS / SwiftUI + TDSKit)

This skill converts Figma designs into SwiftUI code using the **TDSKit** component library. It ensures accurate component matching, proper theming via `@Environment(\.theme)`, and correct interactive behaviors.

## When to Use

Activate this skill when:
- User invokes `/figma-to-ios`
- User provides a Figma URL and mentions iOS or SwiftUI
- User shares a screenshot and asks for iOS implementation
- User asks to "convert this design to iOS code" or "implement this screen in SwiftUI"

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

1. Read the iOS UI quick reference:
   ```
   ios/.claude/claude-ui.md
   ```

2. Read the iOS architecture guide (SwiftUI View Constraints section):
   ```
   ios/.claude/claude-architecture.md
   ```

### Step 3: Identify Visual Elements

Create a checklist of ALL visual elements in the design:
- [ ] Navigation bars / headers
- [ ] Text content (titles, labels, descriptions, captions)
- [ ] Buttons (primary, secondary, icon, circle, link)
- [ ] Icons and their purposes
- [ ] Lists / rows with data
- [ ] Cards / containers / blocks
- [ ] Banners / promotional content
- [ ] Carousels
- [ ] Input fields / search bars
- [ ] Toggles / checkboxes / radio buttons
- [ ] Token / crypto asset icons
- [ ] Loading states / shimmer
- [ ] Empty states
- [ ] Segmented controls / tabs
- [ ] Dividers
- [ ] Toasts / alerts
- [ ] Bottom sheets / modals
- [ ] Tags / badges
- [ ] Progress bars / sliders

### Step 4: Match Components Using Recognition Table

| Figma Element | TDSKit Component | Notes |
|---|---|---|
| Primary filled button | `TDSPrimaryButton(size:, appearance: .primary, style: .fill)` | Full-width action button |
| Secondary / outlined button | `TDSPrimaryButton(size:, appearance: .neutral, style: .subtle)` | Bordered button |
| Ghost / text button | `TDSPrimaryButton(size:, appearance: .primary, style: .ghost)` | Transparent button |
| Error / destructive button | `TDSPrimaryButton(size:, appearance: .error, style: .fill)` | Red action button |
| Success button | `TDSPrimaryButton(size:, appearance: .success, style: .fill)` | Green action button |
| Full-width block button | `TDSBlockButton` | Extends full width |
| Circular icon button with label | `TDSCircleButton` | Icon in circle + label |
| Circular action button | `TDSCircleActionButton` | Action variant |
| Square icon button | `TDSSquaredIconButton` | Squared icon container |
| Rounded square button | `TDSRoundedSquareButton` | Rounded square shape |
| Icon-only button | `TDSIconButton` | No text, icon only |
| Link / text button | `TDSLinkButton` | Text-only tappable |
| Bordered button | `TDSBorderedButton` | Outline style |
| Pill-shaped button / chip | `TDSPillButton` | Pill shape |
| Row with icon, title, value | `TDSListRow` | Standard list row |
| Row with title + value pair | `TDSListTitleValueRow` | Key-value display |
| Row with button action | `TDSButtonRow` | Tappable row |
| Action row | `TDSActionRow` | Row with action |
| Default value row | `TDSDefaultValueRow` | Simple value display |
| Settings row with icon | `TDSListRow` + `SettingsIcon` | Settings-style row |
| Search input | `TDSSearchBar` | Search bar |
| Form text field | `TDSFormTextField` | Text input with validation |
| Multi-line text input | `TDSFormTextView` | Multi-line input |
| Toggle switch | `TDSToggle` | On/off switch |
| Checkbox | `TDSCheckbox` | Check mark selector |
| Checkbox with text | `TDSCheckboxTextButton` | Checkbox + label |
| Radio button | `TDSRadio` | Single selection |
| Banner / promotional card | `TDSBanner` | Promotional banner |
| Alert dialog | `TDSAlertView` | Alert with actions |
| Actions button banner | `TDSActionsButtonBanner` | Banner with buttons |
| Bottom sheet | `BottomSheet` or `BottomModalScreen` | Modal from bottom |
| Information sheet | `TDSInformationSheetView` | Info sheet with actions |
| Segmented control / tabs | `TDSSegmentedControl` | Tab picker |
| Tab bar | `TDSTabBar` | Bottom tab navigation |
| Carousel / horizontal scroll | `TDSCarousel` | Horizontal content |
| Any icon | `TDSIcon` | Renders icon image |
| Remote / async image | `TDSAssetImage` or `CachedAsyncImage` | Async image loading |
| Empty state | `TDSEmptyView` | No-content placeholder |
| Container / card | `TDSBlock` | Grouped content block |
| Form section container | `TDSFormContainer` | Form grouping |
| Expandable section | `TDSExpandableView` | Collapsible content |
| Tag / badge | `TagView` | Label badge |
| VIP tier badge | `TDSVipTierLabel` | Tier indicator |
| Toast notification | `TDSToastView` or `TDSFloatingToastView` | Transient message |
| Progress bar | `TDSProgressBar` | Linear progress |
| Slider | `TDSSlider` | Value slider |
| Divider line | `TDSDivider` | Visual separator |
| Shimmer / skeleton loading | `.tdsShimmer()` modifier | Loading placeholder |
| Spinner loading | `TDSLoadingSpinner` or `LoadingView` | Spinning indicator |
| Dot loading | `DotLoadingView` | Dot animation |
| Highlighted text | `TDSHighlightTextView` | Text with highlights |
| Notification badge | `TDSNotificationView` | Notification indicator |
| Selector / picker | `TDSSelector` | Form selector |
| Dropdown menu | `TDSOptionsDropdownButton` | Dropdown selector |
| Network filter | `TDSNetworkFilter` | Blockchain filter |

### Step 5: Verify Icons Exist

**CRITICAL** - Before using any icon:

1. **R.swift assets** (primary source): Search in `ios/Packages/Assets/Sources/Assets/R.generated.swift`
   ```swift
   // Access pattern:
   Assets.R.image.iconName.image   // SwiftUI Image
   R.image.iconName                // ImageResource
   ```

2. **SF Symbols** (secondary source): Use for system icons
   ```swift
   Image(systemName: "chevron.right")
   Image(systemName: "bell.fill")
   ```

3. **SettingsIcon enum**: For settings-specific icons at `ios/Packages/TDSKit/Sources/TDSKit/Image/SettingsIcon.swift`
   ```swift
   SettingsIcon.about.image
   SettingsIcon.security.image
   ```

**Common verified icons:**

| Action | R.swift Asset | Verified |
|---|---|---|
| Search | `R.image.search` | yes |
| Close | `R.image.close` or `R.image.closeSolid` | yes |
| Chevron right | `R.image.chevronRight` | yes |
| Warning | `R.image.warningSolid` | yes |
| Caret down | `R.image.caretDown` | yes |
| Check | `R.image.checkSolid` | yes |
| Pending | `R.image.pendingSolid` | yes |
| QR Code | `R.image.qrCode` | yes |
| Settings | `R.image.settings` | yes |
| Wallet | `R.image.wallet` | yes |
| Address book | `R.image.addressBook` | yes |

**If an icon is not found:** Search `R.generated.swift` for similar names before falling back to SF Symbols. Never guess icon names.

### Step 6: Read Component Source Files

For EACH matched component, read its source to understand the API:
```
ios/Packages/TDSKit/Sources/TDSKit/{Category}/{ComponentName}.swift
```

iOS does NOT have `.md` docs per component. Read the `.swift` source directly to understand:
- Init parameters and their types
- Required vs optional parameters
- Available styles and configurations
- View builder closures

### Step 7: Implement Interactive Behaviors

**Carousels MUST be scrollable:**
```swift
TDSCarousel(items: items, frameHeight: 96) { item, index in
    // Card content per item
}
```

**Bottom sheets — use BottomModalScreen for result screens:**
```swift
BottomModalScreen(
    image: Assets.R.image.checkSolid.image,
    text: "Success!",
    onFinish: { handleDismiss() }
)
```

**Lists with navigation MUST use action closure:**
```swift
TDSListRow(
    title: "Item",
    subtitle: "Description",
    style: .default,
    action: { handleTap() }
)
```

**Segmented controls MUST use a view model:**
```swift
TDSSegmentedControl(viewModel: segmentedControlViewModel)
// Create viewModel: TDSSegmentedControlViewModel with items and selection binding
```

### Step 8: Use Theme Tokens

**REQUIRED** - All styling must use theme tokens:

```swift
@Environment(\.theme) var theme

// Colors (prefer semantic colors)
theme.color.text.primary          // Primary text
theme.color.text.secondary        // Secondary text
theme.color.background.primary    // Primary background
theme.color.brand.primary         // Brand/accent color
theme.color.button.primary        // Button fill
theme.color.line.divider          // Divider color
theme.color.icon.primary          // Icon tint
theme.color.success.main          // Success green
theme.color.error.main            // Error red
theme.color.warning.main          // Warning yellow

// Legacy color access (also valid)
theme.primary.color               // Brand primary (UIColor -> Color)
theme.textPrimary.color           // Primary text
theme.textSecondary.color         // Secondary text
theme.bg1.color                   // Primary background
theme.iconSecondary.color         // Secondary icon

// Fonts
theme.header32.font               // Bold 32pt header
theme.header24.font               // Bold 24pt header
theme.subheader16.font            // Semibold 16pt subheader
theme.body14.font                 // Medium 14pt body
theme.caption12.font              // Medium 12pt caption

// Layout tokens (NOT from theme)
TDSLayout.Padding.medium          // 16pt padding
TDSLayout.Padding.small           // 8pt padding
TDSLayout.Padding.mediumLarge     // 24pt padding
TDSLayout.Radius.small            // 8pt corner radius
TDSLayout.Radius.medium           // 16pt corner radius
TDSLayout.sizing.largeXX          // 48pt size
```

**Anti-patterns:**
```swift
// WRONG - hardcoded values
.foregroundColor(Color.white)
.padding(16)
.cornerRadius(8)
.font(.system(size: 14))

// CORRECT - theme tokens
.foregroundColor(theme.color.text.primary.color)
.padding(TDSLayout.Padding.medium)
.cornerRadius(TDSLayout.Radius.small)
.font(theme.body14.font)
```

### Step 9: Write Code to File

**CRITICAL: You MUST write the generated code directly to a file using the Write tool. NEVER output code to chat.**

1. **Determine the file path:**
   - Ask the user where to place the file if not specified
   - Typical location: `ios/Trust/UI/{Feature}/{ScreenName}View.swift`
   - Derive name from Figma design (e.g., "Wallet Home" -> `WalletHomeView.swift`)

2. **Use the Write tool immediately** to create the file with the complete implementation

**Code structure to write:**

```swift
import SwiftUI
import TDSKit
import Themes
import Assets

struct ScreenNameView: View {
    @Environment(\.theme) var theme

    // State
    @State private var selectedIndex = 0

    // Callbacks
    var onBack: (() -> Void)?

    var body: some View {
        // Implementation using TDSKit components
        VStack(spacing: TDSLayout.Padding.medium) {
            // Content
        }
        .background(theme.color.background.primary.color)
    }
}

#if DEBUG
struct ScreenNameView_Previews: PreviewProvider {
    static var previews: some View {
        ScreenNameView()
            .environment(\.theme, DefaultTheme())
    }
}
#endif
```

## Verification Checklist

Before writing to file, verify:

### Component Usage
- [ ] Every visual element uses a TDSKit component
- [ ] No custom `Button { }` with manual styling (use `TDSPrimaryButton(size:, appearance:, style:)`, `TDSIconButton`, etc.)
- [ ] No raw `Text()` where theme fonts are needed (use `.font(theme.*.font)`)
- [ ] No custom row Views (use `TDSListRow(title:, subtitle:, style:, action:)`)

### Icon Verification
- [ ] All icons verified in `R.generated.swift` or SF Symbols
- [ ] Icons use `TDSIcon(image:)` or `Image(systemName:)`
- [ ] No assumed icon names - every icon searched and confirmed

### Theme Usage
- [ ] All colors use `theme.*` tokens (no hardcoded hex/Color.*)
- [ ] All spacing uses `TDSLayout.Padding.*` or `TDSLayout.sizing.*`
- [ ] All corner radii use `TDSLayout.Radius.*`
- [ ] All fonts use `theme.*.font` (no `.system()` or `.custom()`)
- [ ] `@Environment(\.theme) var theme` declared

### Props Accuracy
- [ ] Button styles match Figma (fill, subtle, ghost)
- [ ] Color semantics match intent (error=red, success=green)
- [ ] List row styles match design

### Interactive Behavior
- [ ] Carousels are scrollable
- [ ] Bottom sheets are dismissible
- [ ] Toggles bind to state
- [ ] Segmented controls bind to selection
- [ ] Navigation actions connected

### Imports
- [ ] `import SwiftUI`
- [ ] `import TDSKit`
- [ ] `import Themes`
- [ ] `import Assets` (if using R.swift images)

## Output Format

**IMPORTANT: Do NOT output code to chat. Write directly to files.**

After writing the file(s), provide a brief summary:
1. **File created**: Path to the generated view file
2. **Components used**: List of TDSKit components used
3. **Notes**: Any assumptions, missing icons, or components not found

## Example Workflow

### Example 1: User provides both inputs
User: "Here's the Figma URL: https://www.figma.com/design/ABC123?node-id=123-456 and screenshot at /path/to/screenshot.png - implement for iOS"

1. Fetch Figma data using `mcp__figma__get_design_context`
2. View screenshot using `Read` tool
3. Read `ios/.claude/claude-ui.md`
4. Identify elements: Banners, action buttons, token list
5. Read component sources: `TDSBanner.swift`, `TDSCircleButton.swift`, `TDSListRow.swift`
6. Verify icons in `R.generated.swift`
7. **Write code to file using Write tool** (e.g., `WalletHomeView.swift`)
8. Provide brief summary

### Example 2: User invokes skill without inputs
User: "/figma-to-ios"

1. **ASK FOR INPUTS** using AskUserQuestion:
   - Question 1: "What is the Figma URL for the design you want to convert?"
   - Question 2: "Please provide a screenshot of the design (drag & drop or file path)"
2. Wait for user to provide both inputs
3. Proceed with steps 1-8 from Example 1

### Example 3: User provides only one input
User: "Convert this to iOS: https://www.figma.com/design/ABC123?node-id=123-456"

1. **ASK FOR MISSING INPUT** using AskUserQuestion:
   - "Please also provide a screenshot of the design for accurate code generation"
2. Wait for screenshot
3. Proceed with full workflow

## Critical Rules

- **NEVER output code to chat** - always use Write tool to create files
- NEVER improvise components - use only TDSKit components
- ALWAYS read component source files before coding
- ALWAYS verify icons exist before using them
- ALWAYS use `@Environment(\.theme)` for colors and fonts
- ALWAYS use `TDSLayout.*` for spacing, padding, and corner radii
- NEVER hardcode colors, spacing, fonts, or sizes
- Interactive elements must have full behavior, not just visuals
