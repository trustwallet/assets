#!/usr/bin/env bash
# Convert a SpecKit .md file to a self-contained .html viewer page
# Usage: md-to-html.sh <input.md> [--global] [--no-open] [--no-index]
#
# Flags:
#   --global     Generate as a global page (e.g., constitution) — no branch prefix
#   --no-open    Suppress browser auto-open (also creates .no-open marker in feature dir)
#   --no-index   Skip dashboard index regeneration (also creates .no-index marker in feature dir)

set -euo pipefail

SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
TEMPLATE="$SCRIPT_DIR/../../templates/speckit-viewer.html"

if [[ $# -lt 1 ]]; then
    echo "Usage: md-to-html.sh <input.md> [--global] [--no-open] [--no-index]" >&2
    exit 1
fi

INPUT_MD="$1"
GLOBAL_FLAG=""
NO_OPEN_FLAG=""
NO_INDEX_FLAG=""

# Parse optional flags (position-independent)
shift
for arg in "$@"; do
    case "$arg" in
        --global)   GLOBAL_FLAG="--global" ;;
        --no-open)  NO_OPEN_FLAG="1" ;;
        --no-index) NO_INDEX_FLAG="1" ;;
    esac
done

if [[ ! -f "$INPUT_MD" ]]; then
    echo "ERROR: File not found: $INPUT_MD" >&2
    exit 1
fi

# --- Skip checklists/requirements.md (never generate HTML for it) ---
if [[ "$(basename "$INPUT_MD")" == "requirements.md" ]]; then
    _parent_dir=$(basename "$(dirname "$INPUT_MD")")
    if [[ "$_parent_dir" == "checklists" ]]; then
        echo "Skipped (requirements checklist excluded): $INPUT_MD"
        exit 0
    fi
fi

# --- Check for .no-html marker in the feature directory ---
# If a .no-html file exists in the feature's specs dir, skip HTML generation.
# Does not apply to --global pages (e.g. constitution).
if [[ "$GLOBAL_FLAG" != "--global" ]]; then
    _md_dir_abs=$(cd "$(dirname "$INPUT_MD")" && pwd)
    _specs_dir="$REPO_ROOT/knowledge/specs"
    if [[ ! -d "$_specs_dir" && -d "$REPO_ROOT/specs" ]]; then _specs_dir="$REPO_ROOT/specs"; fi
    case "$_md_dir_abs" in
        "$_specs_dir"/*)
            _rel="${_md_dir_abs#$_specs_dir/}"
            _feature_name="${_rel%%/*}"
            if [[ -f "$_specs_dir/$_feature_name/.no-html" ]]; then
                echo "Skipped (HTML disabled for $_feature_name): $INPUT_MD"
                exit 0
            fi
            ;;
    esac
fi

if [[ ! -f "$TEMPLATE" ]]; then
    echo "ERROR: Template not found: $TEMPLATE" >&2
    exit 1
fi

# Extract title from first # heading
TITLE=$(grep -m1 '^# ' "$INPUT_MD" | sed 's/^# //' || echo "SpecKit Document")

# Determine output filename
MD_BASENAME=$(basename "$INPUT_MD" .md)
MD_DIR=$(dirname "$INPUT_MD")

# Get branch name once (reused by compute_nav_data and generate_parent_page)
BRANCH=$(git -C "$REPO_ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
BRANCH_SLUG=$(echo "$BRANCH" | tr '/' '-')

if [[ "$GLOBAL_FLAG" == "--global" ]]; then
    OUTPUT_HTML="$MD_DIR/${MD_BASENAME}.html"
else
    OUTPUT_HTML="$MD_DIR/${BRANCH_SLUG}--${MD_BASENAME}.html"
fi

# Compute feature directory (for parent page generation)
FEATURE_DIR=""
FEATURE_NAME=""
if [[ "$GLOBAL_FLAG" != "--global" ]]; then
    _md_abs=$(cd "$MD_DIR" && pwd)
    _specs="$REPO_ROOT/knowledge/specs"
    if [[ ! -d "$_specs" && -d "$REPO_ROOT/specs" ]]; then _specs="$REPO_ROOT/specs"; fi
    case "$_md_abs" in
        "$_specs"/*)
            _rel="${_md_abs#$_specs/}"
            FEATURE_NAME="${_rel%%/*}"
            FEATURE_DIR="$_specs/$FEATURE_NAME"
            ;;
    esac
fi

# --- Create marker files when flags are set (sticky per-feature) ---
if [[ -n "$FEATURE_DIR" ]]; then
    [[ -n "$NO_OPEN_FLAG" ]]  && touch "$FEATURE_DIR/.no-open"
    [[ -n "$NO_INDEX_FLAG" ]] && touch "$FEATURE_DIR/.no-index"
    # Also check existing markers (sticky: once set, always active for this feature)
    [[ -f "$FEATURE_DIR/.no-open" ]]  && NO_OPEN_FLAG="1"
    [[ -f "$FEATURE_DIR/.no-index" ]] && NO_INDEX_FLAG="1"
fi

# Pure-bash relative path computation (replaces python3 os.path.relpath spawns)
_relpath() {
    local target="${1#/}" base="${2#/}"
    target="${target%/}/"
    base="${base%/}/"
    local t="$target" b="$base"
    while [[ -n "$t" && -n "$b" ]]; do
        local tc="${t%%/*}" bc="${b%%/*}"
        [[ "$tc" != "$bc" ]] && break
        t="${t#*/}"
        b="${b#*/}"
    done
    local result=""
    while [[ -n "$b" ]]; do
        result+="../"
        b="${b#*/}"
    done
    result+="${t%/}"
    [[ -z "$result" ]] && result="."
    echo "$result"
}

# Read template and perform substitutions via perl (bash ${//} is O(n²) on large strings)
INDEX_ABS="$REPO_ROOT/.specify/speckit-index.html"
INDEX_REL=$(_relpath "$INDEX_ABS" "$(cd "$MD_DIR" && pwd)")
# MD_PATH: relative path from repo root to the source .md file (used by edit UI)
INPUT_MD_ABS=$(cd "$(dirname "$INPUT_MD")" && pwd)/$(basename "$INPUT_MD")
MD_PATH="${INPUT_MD_ABS#$REPO_ROOT/}"
# JSON-encode MD_PATH so it's safe inside a JS literal (handles quotes, backslashes)
MD_PATH_JSON=$(printf '%s' "$MD_PATH" | perl -pe 's/\\/\\\\/g; s/"/\\"/g; s/\n/\\n/g; $_ = "\"$_\""')
OUTPUT=$(TITLE="$TITLE" INDEX_REL="$INDEX_REL" MD_PATH_JSON="$MD_PATH_JSON" perl -0777 -pe '
  s/\{\{TITLE\}\}/$ENV{TITLE}/g;
  s/\{\{INDEX_PATH\}\}/$ENV{INDEX_REL}/g;
  s/\{\{MD_PATH_JSON\}\}/$ENV{MD_PATH_JSON}/g;
' "$TEMPLATE")

# --- Compute navigation data for sidebar ---
compute_nav_data() {
    local base_dir="${1:-$MD_DIR}"
    local md_dir_abs
    md_dir_abs=$(cd "$base_dir" && pwd)

    # Detect if this is a feature page (inside knowledge/specs/<feature>/)
    local specs_dir="$REPO_ROOT/knowledge/specs"
    if [[ ! -d "$specs_dir" && -d "$REPO_ROOT/specs" ]]; then specs_dir="$REPO_ROOT/specs"; fi
    local feature_dir=""
    local feature_name=""
    local current_page="$MD_BASENAME"  # e.g. "spec", "plan", "research", etc.

    # Check if MD_DIR is inside knowledge/specs/
    case "$md_dir_abs" in
        "$specs_dir"/*)
            # Could be knowledge/specs/<feature>/ or knowledge/specs/<feature>/checklists/
            local rel_to_specs="${md_dir_abs#$specs_dir/}"
            feature_name="${rel_to_specs%%/*}"
            feature_dir="$specs_dir/$feature_name"
            # If we're in a checklists subdir, note it
            if [[ "$rel_to_specs" == *"/checklists"* ]]; then
                current_page="chk-$MD_BASENAME"
            fi
            ;;
    esac

    # For global pages (constitution etc) or non-feature pages
    if [[ -z "$feature_dir" ]]; then
        if [[ "$GLOBAL_FLAG" == "--global" ]]; then
            current_page="constitution"
        fi
        echo '{}'
        return
    fi

    # Reuse globally computed branch slug (avoids redundant git calls)
    local branch_slug="${BRANCH_SLUG:-unknown}"

    # Helper: check if HTML exists, return relative path from current MD_DIR
    check_html() {
        local search_dir="$1"
        local name="$2"
        local matches=("$search_dir"/*--"${name}".html)
        if [[ -f "${matches[0]:-}" ]]; then
            _relpath "${matches[0]}" "$md_dir_abs"
        fi
    }

    # Build JSON
    local spec_path=$(check_html "$feature_dir" "spec")
    local plan_path=$(check_html "$feature_dir" "plan")
    local research_path=$(check_html "$feature_dir" "research")
    local data_model_path=$(check_html "$feature_dir" "data-model")
    local quickstart_path=$(check_html "$feature_dir" "quickstart")
    local tasks_path=$(check_html "$feature_dir" "tasks")
    local analyze_path=$(check_html "$feature_dir" "analyze")

    # Include the file currently being generated (it doesn't exist on disk yet)
    if [[ -n "${OUTPUT_HTML:-}" ]]; then
        local _output_abs
        _output_abs="$(cd "$(dirname "$OUTPUT_HTML")" 2>/dev/null && pwd)/$(basename "$OUTPUT_HTML")"
        local _output_rel
        _output_rel=$(_relpath "$_output_abs" "$md_dir_abs")
        case "${MD_BASENAME:-}" in
            spec)       [[ -z "$spec_path" ]]       && spec_path="$_output_rel" ;;
            plan)       [[ -z "$plan_path" ]]       && plan_path="$_output_rel" ;;
            research)   [[ -z "$research_path" ]]   && research_path="$_output_rel" ;;
            data-model) [[ -z "$data_model_path" ]] && data_model_path="$_output_rel" ;;
            quickstart) [[ -z "$quickstart_path" ]] && quickstart_path="$_output_rel" ;;
            tasks)      [[ -z "$tasks_path" ]]      && tasks_path="$_output_rel" ;;
            analyze)    [[ -z "$analyze_path" ]]    && analyze_path="$_output_rel" ;;
        esac
    fi

    # Count reviewable sections in feature .md files (for review counters in navbar)
    # H2 sections + H3 "User Story" sections (both get review tags in the viewer)
    count_reviewable() {
        local file="$1"
        [[ -f "$file" ]] || { echo 0; return; }
        local basename_no_ext
        basename_no_ext=$(basename "$file" .md)

        if [[ "$basename_no_ext" == "tasks" ]]; then
            # Tasks: only count Phase sections (enumerated)
            local phase_count
            phase_count=$(grep -ci '^## .*phase' "$file" 2>/dev/null) || phase_count=0
            echo "$phase_count"
            return
        fi

        local h2_count h3_promoted
        h2_count=$(grep -c '^## ' "$file" 2>/dev/null) || h2_count=0
        h3_promoted=0

        if [[ "$basename_no_ext" == "spec" ]]; then
            # Spec: subtract parent wrappers removed in viewer, add promoted H3s
            local h2_us_parent h2_req_parent h3_us h3_ec h3_fr h3_ke h3_td
            h2_us_parent=$(grep -ci '^## User Scenarios' "$file" 2>/dev/null) || h2_us_parent=0
            h2_req_parent=$(grep -ci '^## Requirements' "$file" 2>/dev/null) || h2_req_parent=0
            # Don't subtract "Functional Requirements" — only bare "Requirements"
            local h2_func_req
            h2_func_req=$(grep -ci '^## Functional Requirements' "$file" 2>/dev/null) || h2_func_req=0
            h2_req_parent=$((h2_req_parent - h2_func_req))
            [[ $h2_req_parent -lt 0 ]] && h2_req_parent=0

            h3_us=$(grep -ci '^### .*user story' "$file" 2>/dev/null) || h3_us=0
            h3_ec=$(grep -ci '^### .*edge cases' "$file" 2>/dev/null) || h3_ec=0
            h3_fr=$(grep -ci '^### .*functional requirements' "$file" 2>/dev/null) || h3_fr=0
            h3_ke=$(grep -ci '^### .*key entities' "$file" 2>/dev/null) || h3_ke=0
            h3_td=$(grep -ci '^### .*td-[0-9]' "$file" 2>/dev/null) || h3_td=0
            h3_promoted=$((h3_us + h3_ec + h3_fr + h3_ke + h3_td))
            h2_count=$((h2_count - h2_us_parent - h2_req_parent))
        fi

        echo $((h2_count + h3_promoted))
    }
    local spec_sections=$(count_reviewable "$feature_dir/spec.md")
    local plan_sections=$(count_reviewable "$feature_dir/plan.md")
    local tasks_sections=$(count_reviewable "$feature_dir/tasks.md")

    # Analyze status: "clear" if analyze.md exists and is empty or contains no concerns
    local analyze_clear="False"
    if [[ -f "$feature_dir/analyze.md" ]]; then
        local analyze_content
        analyze_content=$(cat "$feature_dir/analyze.md")
        if [[ -z "$analyze_content" ]] || echo "$analyze_content" | grep -qi 'no concerns found'; then
            analyze_clear="True"
        fi
    fi

    # Implementation status: done if marker file exists
    local impl_done="False"
    if [[ -f "$feature_dir/.implementation-done" ]]; then
        impl_done="True"
    fi

    # Constitution path
    local constitution_path=""
    local const_html="$REPO_ROOT/knowledge/constitution.html"
    if [[ -f "$const_html" ]]; then
        constitution_path=$(_relpath "$const_html" "$md_dir_abs")
    fi

    # Dashboard path
    local dashboard_path
    dashboard_path=$(_relpath "$REPO_ROOT/.specify/speckit-index.html" "$md_dir_abs")

    # Single python3 call: checklist counting + JSON building (avoids double startup cost)
    python3 -c "
import json, os, glob, re
# --- Checklist counting ---
chk_list = []
chk_dir = '$feature_dir/checklists'
branch_slug = '$branch_slug'
if os.path.isdir(chk_dir):
    # Only match HTML files for the current branch slug
    chks = sorted(glob.glob(chk_dir + '/' + branch_slug + '--*.html'))
    seen_names = set()
    for f in chks:
        base = os.path.basename(f).replace('.html','')
        name = base.split('--')[-1] if '--' in base else base
        # Skip requirements checklist and dedup by name
        if name == 'requirements' or name in seen_names: continue
        seen_names.add(name)
        rel = os.path.relpath(f, '$md_dir_abs')
        md_file = os.path.join(os.path.dirname(f), name + '.md')
        checked = total = 0
        if os.path.exists(md_file):
            with open(md_file) as mf:
                for line in mf:
                    if re.match(r'\s*-\s*\[[ xX]\]', line):
                        total += 1
                        if re.match(r'\s*-\s*\[[xX]\]', line):
                            checked += 1
        chk_list.append({'name': name, 'path': rel, 'checked': checked, 'total': total})
# --- Build nav JSON ---
nav = {
    'feature': '$feature_name',
    'currentPage': '$current_page',
    'dashboard': '$dashboard_path',
    'spec': '${spec_path:-}',
    'plan': '${plan_path:-}',
    'research': '${research_path:-}',
    'dataModel': '${data_model_path:-}',
    'quickstart': '${quickstart_path:-}',
    'tasks': '${tasks_path:-}',
    'analyze': '${analyze_path:-}',
    'checklists': chk_list,
    'constitution': '${constitution_path:-}',
    'specSections': int('${spec_sections:-0}'),
    'planSections': int('${plan_sections:-0}'),
    'tasksSections': int('${tasks_sections:-0}'),
    'analyzeClear': $analyze_clear,
    'implementationDone': $impl_done
}
print(json.dumps(nav))
"
}

# Replace {{MARKDOWN}} using perl for reliable substitution (handles escaping + HTML sanitization)
TMPFILE=$(mktemp)
trap 'rm -f "$TMPFILE"' EXIT

# Use perl to read original MD, sanitize, escape, and substitute into template.
# NOTE: {{NAV_DATA}} placeholder is left intact here — it's replaced AFTER the file
# is written, so the nav data includes the newly generated file.
perl -0777 -pe '
    BEGIN {
        local $/;
        open(my $fh, "<", "'"$INPUT_MD"'") or die;
        $md = <$fh>;
        close($fh);
        # Sanitize HTML injection vectors before JS escaping
        $md =~ s/<script/<\x{200B}script/gi;
        $md =~ s/<\/script/<\x{200B}\/script/gi;
        $md =~ s/<iframe/<\x{200B}iframe/gi;
        $md =~ s/<\/iframe/<\x{200B}\/iframe/gi;
        $md =~ s/on(\w+)\s*=/on$1_disabled=/gi;
        $md =~ s/javascript:/javascript\x{200B}:/gi;
        # Escape for JS template literal
        $md =~ s/\\/\\\\/g;
        $md =~ s/`/\\`/g;
        $md =~ s/\$\{/\\\$\{/g;
    }
    s/\{\{MARKDOWN\}\}/$md/;
' <<< "$OUTPUT" > "$TMPFILE"

mv "$TMPFILE" "$OUTPUT_HTML"
trap - EXIT

# --- Now that the HTML file exists on disk, compute nav data and patch it in ---
# This ensures the newly generated file appears in its own nav data and the parent's.
NAV_JSON=$(compute_nav_data)

# Patch {{NAV_DATA}} in the already-written HTML file (use temp file for safe JSON handling)
NAV_TMP=$(mktemp)
echo "$NAV_JSON" > "$NAV_TMP"
perl -0777 -pe '
    BEGIN {
        local $/;
        open(my $fh, "<", "'"$NAV_TMP"'") or die;
        $nav = <$fh>;
        close($fh);
        chomp $nav;
    }
    s/\{\{NAV_DATA\}\}/$nav/;
' "$OUTPUT_HTML" > "${OUTPUT_HTML}.tmp" && mv "${OUTPUT_HTML}.tmp" "$OUTPUT_HTML"
rm -f "$NAV_TMP"

echo "Generated: $OUTPUT_HTML"

# Compute parent page nav data AFTER HTML is written (so checklists glob finds it)
# Skip redundant call when MD_DIR resolves to FEATURE_DIR (the common case)
MD_DIR_ABS=$(cd "$MD_DIR" && pwd)
if [[ -n "$FEATURE_DIR" && "$MD_DIR_ABS" != "$FEATURE_DIR" ]]; then
    PARENT_NAV_JSON=$(compute_nav_data "$FEATURE_DIR")
elif [[ -n "$FEATURE_DIR" ]]; then
    PARENT_NAV_JSON="$NAV_JSON"
else
    PARENT_NAV_JSON="{}"
fi

# --- Regenerate index page ---

# Helper: find HTML file for a given .md basename in a feature dir
# Searches for *--<name>.html pattern, returns relative path or empty
find_html_for() {
    local feature_dir="$1"  # absolute path
    local md_name="$2"      # e.g. "spec", "plan", "tasks"
    local subdir="${3:-}"    # optional subdir like "checklists"

    local search_dir="$feature_dir"
    [[ -n "$subdir" ]] && search_dir="$feature_dir/$subdir"
    [[ -d "$search_dir" ]] || return

    local matches=("$search_dir"/*--"${md_name}".html)
    if [[ -f "${matches[0]:-}" ]]; then
        echo "${matches[0]#$REPO_ROOT/}"
    fi
}

# Helper: emit a file-link div
emit_link() {
    local index_file="$1"
    local rel="$2"          # relative to repo root
    local display="$3"
    local full="$REPO_ROOT/$rel"
    local mtime
    mtime=$(stat -f '%Sm' -t '%Y-%m-%d %H:%M' "$full" 2>/dev/null || echo "")
    local relpath
    relpath=$(_relpath "$REPO_ROOT/$rel" "$REPO_ROOT/.specify")
    if [[ -n "$mtime" ]]; then
        printf '<div class="file-link"><a href="%s">%s</a><span class="meta">%s</span></div>\n' "$relpath" "$display" "$mtime" >> "$index_file"
    else
        printf '<div class="file-link"><a href="%s">%s</a></div>\n' "$relpath" "$display" >> "$index_file"
    fi
}

# Helper: emit link via parent page (with hash fragment) or fall back to direct child link
emit_nav_link() {
    local index_file="$1"
    local parent_rel="$2"   # relative to repo root, or empty
    local child_rel="$3"    # relative to repo root
    local hash_id="$4"      # e.g. "spec", "plan", "chk-requirements"
    local display="$5"

    if [[ -n "$parent_rel" ]]; then
        local full="$REPO_ROOT/$child_rel"
        local mtime
        mtime=$(stat -f '%Sm' -t '%Y-%m-%d %H:%M' "$full" 2>/dev/null || echo "")
        local relpath
        relpath=$(_relpath "$REPO_ROOT/$parent_rel" "$REPO_ROOT/.specify")
        if [[ -n "$mtime" ]]; then
            printf '<div class="file-link"><a href="%s#%s">%s</a><span class="meta">%s</span></div>\n' "$relpath" "$hash_id" "$display" "$mtime" >> "$index_file"
        else
            printf '<div class="file-link"><a href="%s#%s">%s</a></div>\n' "$relpath" "$hash_id" "$display" >> "$index_file"
        fi
    else
        emit_link "$index_file" "$child_rel" "$display"
    fi
}

generate_index() {
    local index_file="$REPO_ROOT/.specify/speckit-index.html"
    local now
    now=$(date '+%Y-%m-%d %H:%M')

    cat > "$index_file" << 'INDEXHEAD'
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SpecKit Dashboard</title>
<style>
:root {
  --page-bg: #f5f5f7; --text: #1d1d1f; --text-secondary: #6e6e73;
  --card-bg: #fff; --card-border: #d2d2d7; --section-header-bg: #e8e8ed;
  --section-header-bg2: #f0f0f5;
  --link: #0066cc; --toolbar-bg: rgba(255,255,255,0.85); --toolbar-border: #d2d2d7;
  --btn-bg: #e8e8ed; --btn-hover: #d2d2d7; --btn-text: #1d1d1f;
  --empty: #8e8e93;
}
[data-theme="dark"] {
  --page-bg: #1c1c1e; --text: #f5f5f7; --text-secondary: #98989d;
  --card-bg: #2c2c2e; --card-border: #3a3a3c; --section-header-bg: #3a3a3c;
  --section-header-bg2: #333335;
  --link: #4dabf7; --toolbar-bg: rgba(44,44,46,0.85); --toolbar-border: #48484a;
  --btn-bg: #3a3a3c; --btn-hover: #48484a; --btn-text: #f5f5f7;
  --empty: #636366;
}
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; background:var(--page-bg); color:var(--text); line-height:1.6; padding:2rem 1rem; }
.toolbar { position:fixed; top:1rem; right:1rem; z-index:100; background:var(--toolbar-bg); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); padding:0.4rem 0.6rem; border-radius:8px; border:1px solid var(--toolbar-border); }
.toolbar button { background:var(--btn-bg); color:var(--btn-text); border:none; padding:0.35rem 0.7rem; border-radius:6px; cursor:pointer; font-size:0.8rem; font-weight:500; transition:background 0.15s; }
.toolbar button:hover { background:var(--btn-hover); }
.container { max-width:860px; margin:0 auto; padding-top:1rem; }
h1 { font-size:2rem; font-weight:700; margin-bottom:0.5rem; }
.subtitle { color:var(--text-secondary); margin-bottom:1.5rem; font-size:0.9rem; }
details { margin-bottom:0.75rem; border-radius:8px; overflow:hidden; border:1px solid var(--card-border); }
summary { padding:0.7rem 1rem; background:var(--section-header-bg); color:var(--text); font-weight:600; cursor:pointer; list-style:none; display:flex; align-items:center; gap:0.5rem; user-select:none; }
summary::-webkit-details-marker { display:none; }
summary::before { content:'\25B6'; font-size:0.7rem; transition:transform 0.2s; flex-shrink:0; }
details[open]>summary::before { transform:rotate(90deg); }
.section-content { padding:1rem; background:var(--card-bg); }
.sub-section { margin:0.5rem 0; border-radius:6px; border:1px solid var(--card-border); overflow:hidden; }
.sub-section summary { font-size:0.9rem; padding:0.5rem 0.8rem; background:var(--section-header-bg2); }
.sub-section .section-content { padding:0.5rem 0.8rem; }
.file-link { display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0; border-bottom:1px solid var(--card-border); }
.file-link:last-child { border-bottom:none; }
.file-link a { color:var(--link); text-decoration:none; font-weight:500; }
.file-link a:hover { text-decoration:underline; }
.file-link .meta { color:var(--text-secondary); font-size:0.8rem; }
.file-link .empty { color:var(--empty); font-size:0.85rem; font-style:italic; }
.global-section { margin-bottom:1rem; padding:1rem; background:var(--card-bg); border:1px solid var(--card-border); border-radius:8px; }
.global-section a { color:var(--link); text-decoration:none; font-weight:500; }
.global-section a:hover { text-decoration:underline; }
</style>
</head>
<body>
<div class="toolbar">
  <button onclick="(function(){var h=document.documentElement,b=document.getElementById('tbtn');if(h.getAttribute('data-theme')==='dark'){h.setAttribute('data-theme','light');b.textContent='Dark';localStorage.setItem('speckit-theme','light');}else{h.setAttribute('data-theme','dark');b.textContent='Light';localStorage.setItem('speckit-theme','dark');}})()" id="tbtn">Dark</button>
</div>
<div class="container">
<h1>SpecKit Dashboard</h1>
INDEXHEAD

    printf '<p class="subtitle">Last updated: %s</p>\n' "$now" >> "$index_file"

    # Global section
    if [[ -f "$REPO_ROOT/knowledge/constitution.html" ]]; then
        local relpath
        relpath=$(_relpath "$REPO_ROOT/knowledge/constitution.html" "$REPO_ROOT/.specify")
        echo '<div class="global-section"><strong>🌐 Global</strong>' >> "$index_file"
        printf '<div class="file-link"><a href="%s">⚖️ constitution</a></div>\n' "$relpath" >> "$index_file"
        echo '</div>' >> "$index_file"
    fi

    # Feature sections: iterate ALL subdirectories in specs dir
    local _idx_specs="$REPO_ROOT/knowledge/specs"
    if [[ ! -d "$_idx_specs" && -d "$REPO_ROOT/specs" ]]; then _idx_specs="$REPO_ROOT/specs"; fi
    if [[ -d "$_idx_specs" ]]; then
        for feature_dir in "$_idx_specs"/*/; do
            [[ -d "$feature_dir" ]] || continue
            local feature_name
            feature_name=$(basename "$feature_dir")

            # Find parent nav page for this feature
            local parent_nav_html
            local _nav_matches=("$feature_dir"/*--nav.html)
            parent_nav_html=""
            [[ -f "${_nav_matches[0]:-}" ]] && parent_nav_html="${_nav_matches[0]}"
            local parent_rel=""
            [[ -n "$parent_nav_html" ]] && parent_rel="${parent_nav_html#$REPO_ROOT/}"

            echo "<details><summary>📦 $feature_name</summary><div class=\"section-content\">" >> "$index_file"

            # 1. Spec (top-level)
            local spec_html
            spec_html=$(find_html_for "$feature_dir" "spec")
            if [[ -n "$spec_html" ]]; then
                emit_nav_link "$index_file" "$parent_rel" "$spec_html" "spec" "📋 spec"
            else
                echo '<div class="file-link"><span class="empty">📋 spec (not generated)</span></div>' >> "$index_file"
            fi

            # 2. Plan subsection: only show expandable if content exists
            local plan_links=""
            local plan_emojis="plan:📐 research:🔬 data-model:🗄️ quickstart:🚀"
            for artifact in plan research data-model quickstart; do
                local art_html
                art_html=$(find_html_for "$feature_dir" "$artifact")
                if [[ -n "$art_html" ]]; then
                    local emoji
                    emoji=$(echo "$plan_emojis" | tr ' ' '\n' | grep "^${artifact}:" | cut -d: -f2)
                    plan_links+="LINK:${art_html}:${artifact}:${emoji} ${artifact}"$'\n'
                fi
            done
            if [[ -n "$plan_links" ]]; then
                echo '<details class="sub-section"><summary>🏗️ Plan</summary><div class="section-content">' >> "$index_file"
                echo "$plan_links" | while IFS= read -r entry; do
                    [[ -z "$entry" ]] && continue
                    local rel="${entry#LINK:}"
                    local path="${rel%%:*}"
                    rel="${rel#*:}"
                    local hash_id="${rel%%:*}"
                    local label="${rel#*:}"
                    emit_nav_link "$index_file" "$parent_rel" "$path" "$hash_id" "$label"
                done
                echo '</div></details>' >> "$index_file"
            else
                echo '<div class="file-link"><span class="empty">🏗️ plan (not generated)</span></div>' >> "$index_file"
            fi

            # 3. Checklists subsection: only show expandable if content exists
            local chk_count=0
            local _chk_files=()
            if [[ -d "$feature_dir/checklists" ]]; then
                _chk_files=("$feature_dir"/checklists/*.html)
                [[ -f "${_chk_files[0]:-}" ]] && chk_count=${#_chk_files[@]} || _chk_files=()
            fi
            if [[ "$chk_count" -gt 0 ]]; then
                echo '<details class="sub-section"><summary>✅ Checklists</summary><div class="section-content">' >> "$index_file"
                local chk_file
                for chk_file in $(printf '%s\n' "${_chk_files[@]}" | sort); do
                    local chk_rel="${chk_file#$REPO_ROOT/}"
                    local chk_name
                    chk_name=$(basename "$chk_file" .html)
                    chk_name="${chk_name##*--}"
                    emit_nav_link "$index_file" "$parent_rel" "$chk_rel" "chk-$chk_name" "☑️ $chk_name"
                done
                echo '</div></details>' >> "$index_file"
            else
                echo '<div class="file-link"><span class="empty">✅ checklists (not generated)</span></div>' >> "$index_file"
            fi

            # 4. Tasks (top-level)
            local tasks_html
            tasks_html=$(find_html_for "$feature_dir" "tasks")
            if [[ -n "$tasks_html" ]]; then
                emit_nav_link "$index_file" "$parent_rel" "$tasks_html" "tasks" "📝 tasks"
            else
                echo '<div class="file-link"><span class="empty">📝 tasks (not generated)</span></div>' >> "$index_file"
            fi

            echo '</div></details>' >> "$index_file"
        done
    fi

    cat >> "$index_file" << 'INDEXFOOT'
</div>
<script>
(function(){var s=localStorage.getItem('speckit-theme');if(s==='dark'){document.documentElement.setAttribute('data-theme','dark');document.getElementById('tbtn').textContent='Light';}})();
(function(){[].forEach.call(document.querySelectorAll('details:not(.sub-section)'),function(d){d.addEventListener('toggle',function(){[].forEach.call(d.querySelectorAll('details.sub-section'),function(s){s.open=d.open;});});});})();
</script>
</body>
</html>
INDEXFOOT

    echo "Index updated: $index_file"
}

# Skip index regeneration when --no-index flag or .no-index marker is active
if [[ -z "$NO_INDEX_FLAG" ]]; then
    generate_index
fi

# --- Generate parent navigation page (replaces sibling regeneration) ---
# The parent page owns the nav sidebar and loads child pages in an iframe.
# Only the parent page is regenerated when a new child appears — O(1) extra work.
generate_parent_page() {
    [[ -n "$FEATURE_DIR" ]] || return
    [[ "$GLOBAL_FLAG" != "--global" ]] || return

    local parent_template="$SCRIPT_DIR/../../templates/speckit-nav-parent.html"
    [[ -f "$parent_template" ]] || return

    local parent_html="$FEATURE_DIR/${BRANCH_SLUG}--nav.html"

    # Skip rebuild if parent page exists and nav data hasn't changed
    if [[ -f "$parent_html" ]]; then
        local existing_nav
        existing_nav=$(perl -ne 'if (/NAV_DATA\s*=\s*(\{.*\})\s*;/) { print $1; exit }' "$parent_html" 2>/dev/null || true)
        if [[ -n "$existing_nav" && "$existing_nav" == "$PARENT_NAV_JSON" ]]; then
            echo "Parent page: $parent_html (unchanged, skipped)"
            return
        fi
    fi

    local index_abs="$REPO_ROOT/.specify/speckit-index.html"
    local index_rel
    index_rel=$(_relpath "$index_abs" "$FEATURE_DIR")

    # Determine the default page hash (checklists use chk- prefix)
    local default_page="$MD_BASENAME"
    local _md_abs_chk
    _md_abs_chk=$(cd "$MD_DIR" && pwd)
    if [[ "$_md_abs_chk" == *"/checklists" ]]; then
        default_page="chk-$MD_BASENAME"
    fi

    # Substitute placeholders via perl (bash ${//} is O(n²) on large strings)
    FEATURE_NAME="$FEATURE_NAME" INDEX_REL="$index_rel" \
    NAV_JSON="$PARENT_NAV_JSON" DEFAULT_PAGE="$default_page" \
    perl -0777 -pe '
      s/\{\{TITLE\}\}/$ENV{FEATURE_NAME}/g;
      s/\{\{INDEX_PATH\}\}/$ENV{INDEX_REL}/g;
      s/\{\{NAV_DATA\}\}/$ENV{NAV_JSON}/g;
      s/\{\{DEFAULT_PAGE\}\}/$ENV{DEFAULT_PAGE}/g;
    ' "$parent_template" > "$parent_html"
    echo "Parent page: $parent_html"
}

generate_parent_page

# --- Auto-start viewer server and open via http:// ---
# Ensures the dev server is running so HTML pages support live editing.
# Falls back to file:// if Node.js is not available.
VIEWER_SERVER="$SCRIPT_DIR/../../../bin/sdd-viewer-server.js"
VIEWER_PORT=""

ensure_viewer_server() {
    # Skip if server script doesn't exist or node is unavailable
    [[ -f "$VIEWER_SERVER" ]] || return 1
    command -v node >/dev/null 2>&1 || return 1

    local result
    result=$(node "$VIEWER_SERVER" start --repo-root "$REPO_ROOT" 2>/dev/null) || return 1

    # Parse output: STARTED:<port>, ALREADY_RUNNING:<port>
    case "$result" in
        STARTED:*|ALREADY_RUNNING:*)
            VIEWER_PORT="${result#*:}"
            return 0
            ;;
    esac
    return 1
}

# Build URL: http:// if server is available, file:// otherwise
build_url() {
    local file_path="$1"
    local hash="${2:-}"
    if [[ -n "$VIEWER_PORT" ]]; then
        # Convert absolute path to relative-to-repo-root for http URL
        local rel="${file_path#$REPO_ROOT/}"
        local url="http://127.0.0.1:${VIEWER_PORT}/${rel}"
        [[ -n "$hash" ]] && url="${url}#${hash}"
        echo "$url"
    else
        local url="file://${file_path}"
        [[ -n "$hash" ]] && url="${url}#${hash}"
        echo "$url"
    fi
}

# Auto-open in browser (via parent page with hash)
# Suppressed by --no-open flag or .no-open marker
# Callers control when to open by passing --no-open on intermediate calls
if [[ -z "$NO_OPEN_FLAG" ]]; then
    # Try to start/reuse viewer server for http:// URLs
    ensure_viewer_server 2>/dev/null || true

    if [[ -n "$FEATURE_DIR" && -f "$FEATURE_DIR/${BRANCH_SLUG}--nav.html" ]]; then
        local_url=$(build_url "$FEATURE_DIR/${BRANCH_SLUG}--nav.html" "$MD_BASENAME")
        open "$local_url" 2>/dev/null || xdg-open "$local_url" 2>/dev/null || true
    else
        local_url=$(build_url "$OUTPUT_HTML")
        open "$local_url" 2>/dev/null || xdg-open "$local_url" 2>/dev/null || true
    fi
fi
