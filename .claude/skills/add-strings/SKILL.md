---
name: add-strings
description: Add user-facing strings to localization files and generate BTS CSV for translation submission. Use when the user asks to add translations, add new strings, add BTS strings, or says /add-strings.
user-invocable: true
---

# Add Strings — BTS Translation Submission

Takes user-facing string key-value pairs and:
1. Adds them to the correct localization files per platform
2. Generates a BTS-compatible CSV for translation submission

## When to Use

Activate this skill when:
- User asks to "add strings", "add translations", or "add BTS strings"
- User provides string key-value pairs to localize
- User mentions `/add-strings`

## Instructions

### 1. Gather Input

Accept string entries in one of these formats:

**Option A — Key/value pairs:** User provides keys and English values directly (in conversation, list, or table).

**Option B — CSV file:** User provides a filled CSV based on the template at `.claude/skills/add-strings/template.csv.sample`:
```csv
"key_(variant)","string_content","instruction","max_length","support_type","placeholder_name"
"MyKey","My English value","","","",""
```

**Option C — Auto-detect from branch diff:** Collect new/changed strings from the current branch vs base:
```bash
BASE=$(git merge-base main HEAD)

# Detect new strings across all platform files
git diff "$BASE"...HEAD -- \
  'tsdk/common/strings/src/commonMain/composeResources/values/strings.xml' \
  'android/common/strings/src/main/res/values/strings_temp.xml' \
  'ios/Packages/Assets/Sources/Assets/Resources/en.lproj/Localizable.strings'
```
Parse added lines:
- **TSDK/Android XML:** `^\+<string name="([^"]+)"[^>]*>(.+?)</string>` — extract key and value
- **iOS .strings:** `^\+"([^"]+)" = "(.*)";` — extract key and value

Parse all entries into a list of `(key, englishValue)` pairs before proceeding.

### 2. Ask Which Platforms

Ask the user which platforms to target (default: all mobile platforms):
- **iOS** — `ios/Packages/Assets/Sources/Assets/Resources/en.lproj/Localizable.strings`
- **Android** — `android/common/strings/src/main/res/values/strings_temp.xml`
- **TSDK (KMP)** — `tsdk/common/strings/src/commonMain/composeResources/values/strings.xml`
- **React Native** — No file changes; output `formatMessage` code snippets

### 3. Validate Keys and Values

For each entry:

- **Dots in keys:** If any key contains `.` (e.g., `QuestMissionList.Title`), **warn the user** that dots break the BTS CSV upload tool — these keys must be submitted manually to BTS. Still add them to localization files, but flag them in the output.
- **Duplicate check:** Search for the key in existing files to avoid duplicates:
  ```bash
  grep -n 'name="KeyName"' tsdk/common/strings/src/commonMain/composeResources/values/strings.xml
  grep -n 'name="KeyName"' android/common/strings/src/main/res/values/strings_temp.xml
  grep -n '"KeyName"' ios/Packages/Assets/Sources/Assets/Resources/en.lproj/Localizable.strings
  ```
  If found, warn the user and ask whether to update or skip.
- **Placeholders:** Note any `%s`, `%d`, `%f`, `%1$s`, `%@` — they must be preserved consistently.

### 4. Add Strings to iOS

**File:** `ios/Packages/Assets/Sources/Assets/Resources/en.lproj/Localizable.strings`

**Format:**
```
"KeyName" = "English value with %@ placeholder";
```

**Rules:**
- String placeholders: `%s` / `%1$s` → `%@`
- Integer placeholders: `%d` stays as `%d`
- Float placeholders: `%f` stays as `%f`
- Literal `%` → `%%`
- Escape `"` inside values as `\"`
- **Append at end** of the file

**Post-add:** Remind user to run `cd ios && make generate` to regenerate `R.generated.swift`.

### 5. Add Strings to Android

**File:** `android/common/strings/src/main/res/values/strings_temp.xml`

**Format:**
```xml
<string name="KeyName" translatable="false">English value with %s placeholder</string>
```

**Rules:**
- **MUST include `translatable="false"`** — these are temporary strings pending BTS translation
- Single string placeholder: `%s`. Multiple of same type: `%1$s`, `%2$s`
- Literal `%` → `%%`
- XML-escape: `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`
- Apostrophes: escape as `\'`
- **Insert before `</resources>`** closing tag

### 6. Add Strings to TSDK (KMP)

**File:** `tsdk/common/strings/src/commonMain/composeResources/values/strings.xml`

**Format:**
```xml
<string name="KeyName">English value with %1$s placeholder</string>
```

**Rules:**
- Placeholders MUST be indexed: `%1$s`, `%2$s` (convert `%s` → `%1$s`, `%2$s`, etc.)
- Literal `%` → `%%`
- XML-escape: `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`
- Apostrophes: escape as `\'`
- **Insert in alphabetical order** by key name
- Accessed via `Res.string.KeyName` / `RString`

### 7. Output React Native Snippets (if selected)

**No file changes needed** for React Native. RN uses `react-intl` with runtime BTS fetch.

Output ready-to-use code snippets for each string:
```typescript
formatMessage({
  id: 'KeyName',
  defaultMessage: 'English value with {param} placeholder',
})
```

**Conversion rules for RN:**
- `%s` / `%1$s` → `{param}` (use descriptive names from context, e.g., `{amount}`, `{token}`)
- `%d` → `{count}` or similar
- The `id` must match the BTS key exactly
- `defaultMessage` is the fallback if BTS fetch fails

### 8. Generate Translator Instructions

For each string, generate a concise `instruction` value for the BTS CSV. This helps translators understand context without seeing the app. Build instructions by combining signals from the key name, string content, and code usage.

**Step 1 — Infer UI element type from the key name:**

| Key suffix/pattern | Inferred type |
|---|---|
| `*Title`, `*Header` | Screen or section title |
| `*Subtitle`, `*Description`, `*Desc` | Descriptive/explanatory text |
| `*Button`, `*Action`, `*Confirm`, `*Cancel`, `*Done`, `*Save` | Button label — keep short |
| `*Label`, `*Name` | UI label |
| `*Placeholder`, `*Hint` | Input field placeholder |
| `*Error`, `*Warning` | Error or warning message |
| `*Info`, `*Note` | Informational note |
| `*Toast`, `*Snackbar` | Transient notification — keep short |
| `*Summary`, `*Format` | Formatted summary string |
| `*Empty`, `*NoResults` | Empty state message |

**Step 2 — Describe placeholders:**

If the string contains `%s`, `%d`, `%1$s`, `%2$s`, etc., search the codebase to determine what each placeholder represents. Look at how the string key is referenced in the code:

```bash
# Search for usage in the codebase
grep -rn "KeyName" --include="*.kt" --include="*.swift" --include="*.tsx" --include="*.ts" -l
```

Then read the relevant usage sites to identify placeholder meanings (e.g., token name, amount, date, count). Produce a placeholder description like:
- `%s is the cryptocurrency name (e.g., "Bitcoin")`
- `%1$s is the amount, %2$s is the date`

If code context is unavailable or ambiguous, infer from the string itself:
- `"Weekly, on %s"` → `%s is a day of the week (e.g., "Monday")`
- `"Redeem %1$s"` → `%1$s is the token/reward name`

**Step 3 — Add length/formatting guidance when relevant:**

- Short UI labels (buttons, tabs, menu items): add `Keep short.`
- Strings with special characters (`*`, `#`, etc.): add `Preserve the leading * character.` or similar
- Questions: add `This is a question — keep the question mark.`
- Strings that are single words or very short: add `Single word.` or `Keep concise.`

**Step 4 — Compose the instruction:**

Combine the signals into a single concise sentence or two. Examples:

| Key | Value | Generated instruction |
|---|---|---|
| `RecurringBuy` | `Recurring buy` | `Feature name used as screen title. Keep concise.` |
| `RecurringBuyFrequency` | `Frequency` | `Label for the buy frequency setting. Single word.` |
| `RecurringBuyInfoTitle` | `What is Recurring Buy?` | `Title for an info sheet explaining recurring buy. Keep the question mark.` |
| `RecurringBuyInfoDescription` | `Recurring Buy (Dollar-Cost Averaging)...` | `Explanatory text for recurring buy feature. Preserve parenthetical abbreviation "DCA".` |
| `RecurringBuySummaryWeeklyOn` | `Weekly, on %s` | `Summary of recurring buy schedule. %s is a day of the week (e.g., "Monday").` |
| `RecurringBuyProviderNote` | `*Mercuryo is the only...` | `Footnote about the provider. Preserve the leading asterisk. "Mercuryo" is a brand name — do not translate.` |
| `ManageRecurringBuy` | `Manage recurring buy` | `Button label to open recurring buy settings. Keep short.` |

### 9. Generate BTS CSV Files

Generate **two separate CSV files** at the project root:

**`mobile.strings.csv`** — for iOS + Android + TSDK (KMP) strings:
```csv
"key_(variant)","string_content","instruction","max_length","support_type","placeholder_name"
"RecurringBuy","Recurring buy","Feature name used as screen title. Keep concise.","","",""
```

**`rn.strings.csv`** — for React Native strings:
```csv
"key_(variant)","string_content","instruction","max_length","support_type","placeholder_name"
"swap.approval-tx-failed","Approval transaction failed. Please try again.","Error message shown when token approval fails.","","",""
```

**Rules:**
- Use **Android-style format specifiers** (`%s`, `%d`, `%1$s`) — NOT iOS `%@`
- Escape double quotes as `""` (standard CSV escaping)
- Only include the newly added entries
- **Fill the `instruction` column** with the generated translator instructions (step 8)
- `max_length`, `support_type`, `placeholder_name` columns are left empty
- **Exclude keys containing dots** from the CSV — list them separately with a warning
- If a string appears in both mobile and RN, include it in **both** CSVs
- If one group has no new strings, **skip generating** that CSV and inform the user

### 10. Summary

After completing all steps, present:

1. **Table of added strings** with columns: Key | English Value | Platforms
2. **Paths to BTS CSVs:**
   - `mobile.strings.csv` (if mobile strings found)
   - `rn.strings.csv` (if RN strings found)
3. **Dot-key warnings** (if any): List keys containing dots that must be submitted manually to BTS
4. **RN snippets** (if applicable): Ready-to-paste `formatMessage` calls
5. **Post-add reminders:**
   ```bash
   # iOS — regenerate R.generated.swift
   cd ios && make generate

   # After BTS processes translations:

   # TSDK — download translations
   cd android && ./gradlew :tsdk:common:strings:downloadTranslations --stringKeys="Key1,Key2"

   # Android — download translations (moves from strings_temp to strings.xml)
   cd android && ./gradlew :android:common:strings:downloadTranslations --stringKeys="Key1,Key2"

   # iOS — download translations
   cd ios && make localize
   ```

## Placeholder Conversion Reference

| BTS CSV (source) | TSDK (KMP)  | Android (`strings_temp`) | iOS              | React Native (`formatMessage`) |
|------------------|-------------|--------------------------|------------------|-------------------------------|
| `%s`             | `%1$s`      | `%s`                     | `%@`             | `{param}`                     |
| `%d`             | `%1$d`      | `%d`                     | `%d`             | `{count}`                     |
| `%f`             | `%1$f`      | `%f`                     | `%f`             | `{value}`                     |
| `%1$s`, `%2$s`   | `%1$s`, `%2$s` | `%1$s`, `%2$s`        | `%@`, `%@`       | `{param1}`, `{param2}`        |
| `%%` (literal)   | `%%`        | `%%`                     | `%%`             | `%`                           |

## Template Reference

The CSV template is at `.claude/skills/add-strings/template.csv.sample`.
