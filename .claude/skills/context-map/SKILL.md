---
name: context-map
description: Build and open the context map viewer. Use when the user wants to view, rebuild, or open the context map documentation.
user-invocable: true
---

# Context Map

Build the content bundle and open the browser-based context map viewer.

## Instructions

### 1. Build the content bundle

Run the build script to generate `_content.js` from all markdown files:

```bash
node context-map/tools/build.js
```

Verify the output shows the number of files processed.

### 2. Open the viewer

```bash
open context-map/viewer.html
```

### 3. Report result

Tell the user the build succeeded with the file count, and that the viewer is opening in their browser.
