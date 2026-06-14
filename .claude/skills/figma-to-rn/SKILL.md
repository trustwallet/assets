---
name: figma-to-rn
description: Generate React Native code from Figma designs. Use when user provides a Figma URL and/or screenshot and wants to convert it to code using @trustwallet/ui components. Also use when user says /figma-to-rn. (project)
user-invocable: true
---

# Figma to Code Generator

This skill converts Figma designs into React Native code using the `@trustwallet/ui` component library. It ensures accurate component matching, proper theming, and correct interactive behaviors.

## When to Use

Activate this skill when:
- User invokes `/figma-to-rn`
- User provides a Figma URL (figma.com/design/... or figma.com/file/...)
- User shares a screenshot of a UI design
- User asks to "convert this design to code" or "implement this screen"
- User mentions implementing a specific screen from Figma

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
Use the mcp__figma__get_figma_data tool to fetch design data:
- Extract fileKey from URL
- Extract nodeId from URL (node-id parameter)
```

**Screenshot** (REQUIRED):
```
Use the Read tool to view the screenshot image
- This provides visual context that Figma data may miss
- Use this to verify colors, spacing, and visual hierarchy
```

### Step 2: Read Component Documentation

**MANDATORY** - Before writing ANY code:

1. Read the component index:
   ```
   /react-native/packages/ui/docs/components/index.md
   ```

2. Read the Figma-to-code rules:
   ```
   /react-native/packages/ui/docs/FIGMA_TO_CODE_RULES.md
   ```

### Step 3: Identify Visual Elements

Create a checklist of ALL visual elements in the design:
- [ ] Headers/Navigation bars
- [ ] Text content (titles, labels, descriptions)
- [ ] Buttons (primary, secondary, action)
- [ ] Icons and their purposes
- [ ] Lists/rows with data
- [ ] Cards/containers
- [ ] Banners/promotional content
- [ ] Carousels with pagination
- [ ] Input fields
- [ ] Toggles/checkboxes
- [ ] Token/crypto icons
- [ ] Loading states
- [ ] Empty states

### Step 4: Match Components Using Recognition Table

| Figma Element | Component | Import |
|--------------|-----------|--------|
| Circular icon button with label | `ActionButton` | `ActionButton, IconNameEnum` |
| Horizontal scrolling cards with dots | `BannerCarousel` | `BannerCarousel, BannerCarouselItem` |
| Single promotional card with badge | `Banner` | `Banner` |
| Row with icon, title, values | `List` + `ListItem` | See List.md |
| Crypto token icon | `Token` | `Token` |
| Pagination dots | `PageControl` | `PageControl` |
| Any text content | `Typography` | `Typography` |
| Any icon | `Icon` | `Icon, IconNameEnum` |
| Primary action button | `Button` kind="primary" | `Button` |
| Secondary action button | `Button` kind="secondary" | `Button` |
| Bottom sheet | `Sheet` | `Sheet` |
| Tab bar segments | `SegmentedControl` | `SegmentedControl` |
| Toggle switch | `Toggle` | `Toggle` |
| Checkbox | `Checkbox` | `Checkbox` |
| Search input | `SearchInput` | `SearchInput` |
| Text input | `Input` | `Input` |
| Loading skeleton | `Skeleton` | `Skeleton` |
| Spinner | `Spinner` | `Spinner` |
| Toast notification | `Toast` | `Toast` |
| Alert banner | `Alert` | `Alert` |
| Card container | `Container` | `Container` |
| Empty state | `EmptyState` | `EmptyState` |

### Step 5: Verify Icons Exist

**CRITICAL** - Before using any icon:

1. Check `/react-native/packages/ui/src/assets/icons/types/IconName.ts`
2. Search for the exact icon name
3. If not found, use verified alternatives:

| Action | Icon | Verified |
|--------|------|----------|
| Send | `IconNameEnum.Send` | ✅ |
| Receive | `IconNameEnum.ArrowDown` | ✅ |
| Swap | `IconNameEnum.Swap` | ✅ |
| Buy/Fund | `IconNameEnum.Buy` | ✅ |
| Sell | `IconNameEnum.Cashout` | ✅ |
| Earn | `IconNameEnum.Earn` | ✅ |
| Copy | `IconNameEnum.Copy` | ✅ |
| QR Scan | `IconNameEnum.QrCode` | ✅ |
| Settings | `IconNameEnum.Settings` | ✅ |
| Close | `IconNameEnum.Close` | ✅ |
| Back | `IconNameEnum.ChevronLeft` | ✅ |

**Icons that DON'T exist:**
- ❌ `Bank` → use `Cashout`
- ❌ `Leaf` → use `Earn`
- ❌ `X` → use `Close`
- ❌ `Drop` → use `Buy` or `Hot`
- ❌ `Chart` → use `Markets`

### Step 6: Read Component Documentation

For EACH matched component, read its documentation:
```
/react-native/packages/ui/docs/components/{ComponentName}.md
```

And check the example screen:
```
/react-native/packages/features/examples/src/screens/{ComponentName}Screen.tsx
```

### Step 7: Implement Interactive Behaviors

**Carousels with pagination dots MUST be swipeable:**

```tsx
import { useState, useRef } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { Banner, PageControl, useTheme } from '@trustwallet/ui';

const { width: screenWidth } = useWindowDimensions();
const [currentPage, setCurrentPage] = useState(0);
const scrollViewRef = useRef<ScrollView>(null);

const handleScroll = (event) => {
  const page = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
  if (page !== currentPage) setCurrentPage(page);
};

const handlePagePress = (index: number) => {
  setCurrentPage(index);
  scrollViewRef.current?.scrollTo({ x: index * screenWidth, animated: true });
};

<ScrollView
  ref={scrollViewRef}
  horizontal
  pagingEnabled
  onScroll={handleScroll}
  scrollEventThrottle={16}
>
  {items.map((item) => (
    <View key={item.id} style={{ width: screenWidth }}>
      <Banner {...item} />
    </View>
  ))}
</ScrollView>
<PageControl
  numberOfPages={items.length}
  currentPage={currentPage}
  onPagePress={handlePagePress}
/>
```

### Step 8: Use Theme Tokens

**REQUIRED** - All styling must use theme tokens:

```tsx
const { palette, spacing, colors } = useTheme();

// ✅ Correct
style={{ backgroundColor: palette.background.primary }}
style={{ padding: spacing.md }}
style={{ color: colors.brandPrimary }}

// ❌ Wrong - hardcoded values
style={{ backgroundColor: '#FFFFFF' }}
style={{ padding: 16 }}
```

### Step 9: Write Code to File

**CRITICAL: You MUST write the generated code directly to a file using the Write tool. NEVER output code to chat.**

1. **Determine the file path:**
   - Default location: `/react-native/packages/features/examples/src/screens/{ScreenName}Screen.tsx`
   - If user specifies a different location, use that instead
   - Derive screen name from the Figma design (e.g., "Wallet Home" → `WalletHomeScreen.tsx`)

2. **Use the Write tool immediately** to create the file with the complete implementation

3. **Update the component registry** at `/react-native/packages/features/examples/src/componentRegistry.ts`:
   - Add import for the new screen
   - Add entry to `COMPONENT_REGISTRY`

**Code structure to write:**

```tsx
// React imports
import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// UI Components (alphabetical)
import {
  // List all components used
  useTheme,
} from '@trustwallet/ui';

// Types and data
interface ScreenProps {
  onBack?: () => void;
}

// Component implementation
export const ScreenName: React.FC<ScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const { palette, spacing, colors } = useTheme();

  // State and handlers

  return (
    // JSX using library components
  );
};

// Styles using theme tokens only for layout
const styles = StyleSheet.create({
  // Only View/layout styles, no component styling
});
```

## Verification Checklist

Before writing to file, verify:

### Component Usage
- [ ] Every visual element uses a library component
- [ ] No custom `TouchableOpacity` (use `Button`, `ListItem`)
- [ ] No custom `Text` (use `Typography`)
- [ ] Compound components use all subcomponents

### Icon Verification
- [ ] All icons verified in `IconName.ts`
- [ ] All icons use `IconNameEnum.*`
- [ ] No assumed icons (Bank, Leaf, X)

### Theme Usage
- [ ] All colors use theme tokens
- [ ] All spacing uses theme tokens

### Props Accuracy
- [ ] Button `kind` matches visual (primary=filled, secondary=outlined)
- [ ] Variants match design (positive=green, negative=red)

### Interactive Behavior
- [ ] Carousels with dots are swipeable
- [ ] PageControl connected to scroll
- [ ] Dots navigate on tap

## Output Format

**IMPORTANT: Do NOT output code to chat. Write directly to files.**

After writing the file(s), provide a brief summary:
1. **File created**: Path to the generated screen file
2. **Components used**: List of `@trustwallet/ui` components used
3. **Notes**: Any assumptions, missing icons, or components not found

## Example Workflow

### Example 1: User provides both inputs
User: "Here's the Figma URL: https://www.figma.com/design/ABC123?node-id=123-456 and screenshot at /path/to/screenshot.png"

1. Fetch Figma data using `mcp__figma__get_figma_data`
2. View screenshot using `Read` tool
3. Read `/react-native/packages/ui/docs/components/index.md`
4. Read `/react-native/packages/ui/docs/FIGMA_TO_CODE_RULES.md`
5. Identify elements: Banner carousel, ActionButtons, Token list
6. Read relevant docs: `Banners.md`, `ActionButton.md`, `List.md`, `Token.md`
7. Check example screens for patterns
8. Verify icons in `IconName.ts`
9. **Write code to file using Write tool** (e.g., `WalletHomeScreen.tsx`)
10. **Update componentRegistry.ts** to register the new screen
11. Provide brief summary of what was created

### Example 2: User invokes skill without inputs
User: "/figma-to-rn"

1. **ASK FOR INPUTS** using AskUserQuestion:
   - Question 1: "What is the Figma URL for the design you want to convert?"
   - Question 2: "Please provide a screenshot of the design (drag & drop or file path)"
2. Wait for user to provide both inputs
3. Proceed with steps 1-11 from Example 1

### Example 3: User provides only one input
User: "Convert this to code: https://www.figma.com/design/ABC123?node-id=123-456"

1. **ASK FOR MISSING INPUT** using AskUserQuestion:
   - "Please also provide a screenshot of the design for accurate code generation"
2. Wait for screenshot
3. Proceed with full workflow

## Critical Rules

- **NEVER output code to chat** - always use Write tool to create files
- NEVER improvise components - use only `@trustwallet/ui`
- ALWAYS read documentation before coding
- ALWAYS verify icons exist before using
- ALWAYS write to file, then update componentRegistry.ts
- Interactive elements must have full behavior, not just visuals
