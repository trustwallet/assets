#!/usr/bin/env bash

set -e

JSON_MODE=false
SHORT_NAME=""
BRANCH_NUMBER=""
SC_TICKET=""
USE_CURRENT_BRANCH=false
ARGS=()
i=1
while [ $i -le $# ]; do
    arg="${!i}"
    case "$arg" in
        --json) 
            JSON_MODE=true 
            ;;
        --short-name)
            if [ $((i + 1)) -gt $# ]; then
                echo 'Error: --short-name requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            # Check if the next argument is another option (starts with --)
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --short-name requires a value' >&2
                exit 1
            fi
            SHORT_NAME="$next_arg"
            ;;
        --number)
            if [ $((i + 1)) -gt $# ]; then
                echo 'Error: --number requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --number requires a value' >&2
                exit 1
            fi
            BRANCH_NUMBER="$next_arg"
            ;;
        --sc-ticket)
            if [ $((i + 1)) -gt $# ]; then
                echo 'Error: --sc-ticket requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --sc-ticket requires a value' >&2
                exit 1
            fi
            SC_TICKET="$next_arg"
            ;;
        --current-branch)
            USE_CURRENT_BRANCH=true
            ;;
        --help|-h)
            echo "Usage: $0 [--json] [--short-name <name>] [--number N] [--sc-ticket SC-XXXXX] [--current-branch] <feature_description>"
            echo ""
            echo "Options:"
            echo "  --json                Output in JSON format"
            echo "  --short-name <name>   Provide a custom short name (2-4 words) for the branch"
            echo "  --number N            Specify branch number manually (overrides auto-detection)"
            echo "  --sc-ticket SC-XXXXX  Use SC ticket as branch prefix instead of number"
            echo "  --current-branch      Use the current git branch instead of creating a new one."
            echo "                        Also honored via the SPECIFY_USE_CURRENT_BRANCH env var."
            echo "                        FEATURE_DIR_NAME is derived from the current branch unless"
            echo "                        --short-name / --number / --sc-ticket is also passed."
            echo "  --help, -h            Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 'Add user authentication system' --short-name 'user-auth'"
            echo "  $0 'Implement OAuth2 integration for API' --number 5"
            echo "  $0 --sc-ticket SC-117945 --short-name 'prediction-default' 'Add prediction default crypto'"
            echo "  $0 --current-branch 'Continue work on the existing branch'"
            exit 0
            ;;
        *) 
            ARGS+=("$arg") 
            ;;
    esac
    i=$((i + 1))
done

FEATURE_DESCRIPTION="${ARGS[*]}"
if [ -z "$FEATURE_DESCRIPTION" ]; then
    echo "Usage: $0 [--json] [--short-name <name>] [--number N] [--sc-ticket SC-XXXXX] [--current-branch] <feature_description>" >&2
    exit 1
fi

# SPECIFY_USE_CURRENT_BRANCH env var mirrors the --current-branch flag so callers
# (e.g. agent runners that don't control the slash-command invocation) can opt in
# without changing arguments. Any non-empty value other than "0"/"false"/"no"/"off"
# (case-insensitive) enables it.
SPECIFY_USE_CURRENT_BRANCH_LC=$(printf '%s' "${SPECIFY_USE_CURRENT_BRANCH:-}" | tr '[:upper:]' '[:lower:]')
case "$SPECIFY_USE_CURRENT_BRANCH_LC" in
    ""|"0"|"false"|"no"|"off") ;;  # disabled — leave USE_CURRENT_BRANCH as-is
    *) USE_CURRENT_BRANCH=true ;;
esac
unset SPECIFY_USE_CURRENT_BRANCH_LC

# Snapshot user-supplied naming flags before auto-detection mutates BRANCH_NUMBER.
# Used by the --current-branch override below to decide whether the spec dir
# should track the branch (none supplied) or honor explicit caller intent.
USER_SHORT_NAME="$SHORT_NAME"
USER_BRANCH_NUMBER="$BRANCH_NUMBER"
USER_SC_TICKET="$SC_TICKET"

# Function to find the repository root by searching for existing project markers
find_repo_root() {
    local dir="$1"
    while [ "$dir" != "/" ]; do
        if [ -d "$dir/.git" ] || [ -d "$dir/.specify" ]; then
            echo "$dir"
            return 0
        fi
        dir="$(dirname "$dir")"
    done
    return 1
}

# Function to get highest number from specs directory
get_highest_from_specs() {
    local specs_dir="$1"
    local highest=0
    
    if [ -d "$specs_dir" ]; then
        for dir in "$specs_dir"/*; do
            [ -d "$dir" ] || continue
            dirname=$(basename "$dir")
            number=$(echo "$dirname" | grep -o '^[0-9]\+' || echo "0")
            number=$((10#$number))
            if [ "$number" -gt "$highest" ]; then
                highest=$number
            fi
        done
    fi
    
    echo "$highest"
}

# Function to get highest number from git branches
get_highest_from_branches() {
    local highest=0
    
    # Get all branches (local and remote)
    branches=$(git branch -a 2>/dev/null || echo "")
    
    if [ -n "$branches" ]; then
        while IFS= read -r branch; do
            # Clean branch name: remove leading markers and remote prefixes
            clean_branch=$(echo "$branch" | sed 's/^[* ]*//; s|^remotes/[^/]*/||')
            
            # Extract feature number if branch matches pattern ###-*
            if echo "$clean_branch" | grep -q '^[0-9]\{3\}-'; then
                number=$(echo "$clean_branch" | grep -o '^[0-9]\{3\}' || echo "0")
                number=$((10#$number))
                if [ "$number" -gt "$highest" ]; then
                    highest=$number
                fi
            fi
        done <<< "$branches"
    fi
    
    echo "$highest"
}

# Function to check existing branches (local and remote) and return next available number
check_existing_branches() {
    local specs_dir="$1"

    # Fetch all remotes to get latest branch info (suppress errors if no remotes)
    git fetch --all --prune 2>/dev/null || true

    # Get highest number from ALL branches (not just matching short name)
    local highest_branch=$(get_highest_from_branches)

    # Get highest number from ALL specs (not just matching short name)
    local highest_spec=$(get_highest_from_specs "$specs_dir")

    # Take the maximum of both
    local max_num=$highest_branch
    if [ "$highest_spec" -gt "$max_num" ]; then
        max_num=$highest_spec
    fi

    # Return next number
    echo $((max_num + 1))
}

# Function to clean and format a branch name
clean_branch_name() {
    local name="$1"
    echo "$name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-\+/-/g' | sed 's/^-//' | sed 's/-$//'
}

# Resolve repository root. Prefer git information when available, but fall back
# to searching for repository markers so the workflow still functions in repositories that
# were initialised with --no-git.
SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if git rev-parse --show-toplevel >/dev/null 2>&1; then
    REPO_ROOT=$(git rev-parse --show-toplevel)
    HAS_GIT=true
else
    REPO_ROOT="$(find_repo_root "$SCRIPT_DIR")"
    if [ -z "$REPO_ROOT" ]; then
        echo "Error: Could not determine repository root. Please run this script from within the repository." >&2
        exit 1
    fi
    HAS_GIT=false
fi

cd "$REPO_ROOT"

SPECS_DIR="$REPO_ROOT/knowledge/specs"
if [[ ! -d "$SPECS_DIR" && -d "$REPO_ROOT/specs" ]]; then
    SPECS_DIR="$REPO_ROOT/specs"
fi
mkdir -p "$SPECS_DIR"

# Function to generate branch name with stop word filtering and length filtering
generate_branch_name() {
    local description="$1"
    
    # Common stop words to filter out
    local stop_words="^(i|a|an|the|to|for|of|in|on|at|by|with|from|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|should|could|can|may|might|must|shall|this|that|these|those|my|your|our|their|want|need|add|get|set)$"
    
    # Convert to lowercase and split into words
    local clean_name=$(echo "$description" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/ /g')
    
    # Filter words: remove stop words and words shorter than 3 chars (unless they're uppercase acronyms in original)
    local meaningful_words=()
    for word in $clean_name; do
        # Skip empty words
        [ -z "$word" ] && continue
        
        # Keep words that are NOT stop words AND (length >= 3 OR are potential acronyms)
        if ! echo "$word" | grep -qiE "$stop_words"; then
            if [ ${#word} -ge 3 ]; then
                meaningful_words+=("$word")
            elif echo "$description" | grep -q "\b${word^^}\b"; then
                # Keep short words if they appear as uppercase in original (likely acronyms)
                meaningful_words+=("$word")
            fi
        fi
    done
    
    # If we have meaningful words, use first 3-4 of them
    if [ ${#meaningful_words[@]} -gt 0 ]; then
        local max_words=3
        if [ ${#meaningful_words[@]} -eq 4 ]; then max_words=4; fi
        
        local result=""
        local count=0
        for word in "${meaningful_words[@]}"; do
            if [ $count -ge $max_words ]; then break; fi
            if [ -n "$result" ]; then result="$result-"; fi
            result="$result$word"
            count=$((count + 1))
        done
        echo "$result"
    else
        # Fallback to original logic if no meaningful words found
        local cleaned=$(clean_branch_name "$description")
        echo "$cleaned" | tr '-' '\n' | grep -v '^$' | head -3 | tr '\n' '-' | sed 's/-$//'
    fi
}

# Generate branch name
if [ -n "$SHORT_NAME" ]; then
    # Use provided short name, just clean it up
    BRANCH_SUFFIX=$(clean_branch_name "$SHORT_NAME")
else
    # Generate from description with smart filtering
    BRANCH_SUFFIX=$(generate_branch_name "$FEATURE_DESCRIPTION")
fi

# Determine branch prefix: SC ticket or auto-incremented number
if [ -n "$SC_TICKET" ]; then
    # Normalize SC ticket to uppercase for branch, lowercase for folder
    SC_UPPER=$(echo "$SC_TICKET" | sed 's/^sc-/SC-/I')
    SC_LOWER=$(echo "$SC_TICKET" | tr '[:upper:]' '[:lower:]')
    FEATURE_NUM="$SC_UPPER"
    # Branch: feature/SC-XXXXX/brief-desc
    BRANCH_NAME="feature/${SC_UPPER}/${BRANCH_SUFFIX}"
    # Specs folder: sc-XXXXX-brief-desc (flat, no slashes)
    FEATURE_DIR_NAME="${SC_LOWER}-${BRANCH_SUFFIX}"
else
    # Determine branch number
    if [ -z "$BRANCH_NUMBER" ]; then
        if [ "$USE_CURRENT_BRANCH" = "true" ]; then
            # In --current-branch mode the auto-generated BRANCH_NAME is
            # discarded by the override block below, so don't pay the
            # `git fetch --all --prune` cost that check_existing_branches
            # incurs — that network call can hang in ephemeral runners
            # (CI workers, agent session pods) without git credentials.
            # Fall back to a local-only scan; collisions in FEATURE_DIR
            # are tolerable because mkdir -p is idempotent and re-running
            # specify on an existing spec dir is a normal pattern.
            HIGHEST=$(get_highest_from_specs "$SPECS_DIR")
            BRANCH_NUMBER=$((HIGHEST + 1))
        elif [ "$HAS_GIT" = true ]; then
            # Check existing branches on remotes
            BRANCH_NUMBER=$(check_existing_branches "$SPECS_DIR")
        else
            # Fall back to local directory check
            HIGHEST=$(get_highest_from_specs "$SPECS_DIR")
            BRANCH_NUMBER=$((HIGHEST + 1))
        fi
    fi

    # Force base-10 interpretation to prevent octal conversion
    FEATURE_NUM=$(printf "%03d" "$((10#$BRANCH_NUMBER))")
    BRANCH_NAME="${FEATURE_NUM}-${BRANCH_SUFFIX}"
    FEATURE_DIR_NAME="$BRANCH_NAME"
fi

# GitHub enforces a 244-byte limit on branch names
# Validate and truncate if necessary
MAX_BRANCH_LENGTH=244
if [ ${#BRANCH_NAME} -gt $MAX_BRANCH_LENGTH ]; then
    if [ -n "$SC_TICKET" ]; then
        # Account for: "feature/" (8) + SC ticket + "/" (1) = prefix
        SC_UPPER=$(echo "$SC_TICKET" | sed 's/^sc-/SC-/I')
        PREFIX_LEN=$((8 + ${#SC_UPPER} + 1))
        MAX_SUFFIX_LENGTH=$((MAX_BRANCH_LENGTH - PREFIX_LEN))
    else
        # Account for: feature number (3) + hyphen (1) = 4 chars
        MAX_SUFFIX_LENGTH=$((MAX_BRANCH_LENGTH - 4))
    fi

    # Truncate suffix at word boundary if possible
    TRUNCATED_SUFFIX=$(echo "$BRANCH_SUFFIX" | cut -c1-$MAX_SUFFIX_LENGTH)
    # Remove trailing hyphen if truncation created one
    TRUNCATED_SUFFIX=$(echo "$TRUNCATED_SUFFIX" | sed 's/-$//')

    ORIGINAL_BRANCH_NAME="$BRANCH_NAME"
    if [ -n "$SC_TICKET" ]; then
        BRANCH_NAME="feature/${SC_UPPER}/${TRUNCATED_SUFFIX}"
        SC_LOWER=$(echo "$SC_TICKET" | tr '[:upper:]' '[:lower:]')
        FEATURE_DIR_NAME="${SC_LOWER}-${TRUNCATED_SUFFIX}"
    else
        BRANCH_NAME="${FEATURE_NUM}-${TRUNCATED_SUFFIX}"
        FEATURE_DIR_NAME="$BRANCH_NAME"
    fi

    >&2 echo "[specify] Warning: Branch name exceeded GitHub's 244-byte limit"
    >&2 echo "[specify] Original: $ORIGINAL_BRANCH_NAME (${#ORIGINAL_BRANCH_NAME} bytes)"
    >&2 echo "[specify] Truncated to: $BRANCH_NAME (${#BRANCH_NAME} bytes)"
fi

# --current-branch / SPECIFY_USE_CURRENT_BRANCH override: keep the caller's branch
# instead of forking a new one. The auto-generated BRANCH_NAME from the block above
# is discarded (and so is any truncation of it). FEATURE_DIR_NAME is preserved when
# the caller passed --short-name / --number / --sc-ticket; otherwise it is derived
# from the current branch (sanitized) so spec dirs track the branch.
if [ "$USE_CURRENT_BRANCH" = "true" ]; then
    if [ "$HAS_GIT" != "true" ]; then
        echo "Error: --current-branch requires a git repository" >&2
        exit 1
    fi
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
    if [ -z "$CURRENT_BRANCH" ] || [ "$CURRENT_BRANCH" = "HEAD" ]; then
        echo "Error: --current-branch requires a named branch (detached HEAD or no commits)" >&2
        exit 1
    fi
    BRANCH_NAME="$CURRENT_BRANCH"
    if [ -z "$USER_SHORT_NAME" ] && [ -z "$USER_BRANCH_NUMBER" ] && [ -z "$USER_SC_TICKET" ]; then
        # Sanitize the current branch into a valid dir name: lowercase, then
        # replace any char outside [a-z0-9-] (including '/') with '-'. Use
        # `tr -s -` to squeeze hyphen runs (POSIX-portable; sed `\+` is GNU-only,
        # silently no-ops on BSD sed / macOS). Trim leading/trailing hyphens via
        # shell parameter expansion.
        FEATURE_DIR_NAME=$(echo "$CURRENT_BRANCH" | tr '[:upper:]' '[:lower:]' \
            | sed 's|[^a-z0-9-]|-|g' \
            | tr -s -)
        FEATURE_DIR_NAME="${FEATURE_DIR_NAME#-}"
        FEATURE_DIR_NAME="${FEATURE_DIR_NAME%-}"
        # Pathological branches (e.g. all underscores/symbols) can sanitize to "".
        # Fall back to a stable literal so FEATURE_DIR doesn't collapse to SPECS_DIR
        # itself, which would cause spec.md to land directly in the specs root.
        if [ -z "$FEATURE_DIR_NAME" ]; then
            FEATURE_DIR_NAME="current-branch"
        fi
        FEATURE_NUM="(current)"
    fi
fi

if [ "$HAS_GIT" = true ] && [ "$USE_CURRENT_BRANCH" != "true" ]; then
    git checkout -b "$BRANCH_NAME"
elif [ "$USE_CURRENT_BRANCH" = "true" ]; then
    >&2 echo "[specify] --current-branch set; staying on $BRANCH_NAME"
else
    >&2 echo "[specify] Warning: Git repository not detected; skipped branch creation for $BRANCH_NAME"
fi

FEATURE_DIR="$SPECS_DIR/$FEATURE_DIR_NAME"
mkdir -p "$FEATURE_DIR"

TEMPLATE="$REPO_ROOT/.specify/templates/spec-template.md"
SPEC_FILE="$FEATURE_DIR/spec.md"
if [ -f "$TEMPLATE" ]; then cp "$TEMPLATE" "$SPEC_FILE"; else touch "$SPEC_FILE"; fi

# Set the SPECIFY_FEATURE environment variable for the current session
export SPECIFY_FEATURE="$BRANCH_NAME"

if $JSON_MODE; then
    # Minimal JSON string-escape: backslash and double-quote. Git refs disallow
    # most other special chars (including `\` per check-ref-format), but file paths
    # under SPEC_FILE/FEATURE_DIR can theoretically contain quotes or backslashes,
    # so we escape every field defensively to keep --json output parseable.
    json_escape() { printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'; }
    printf '{"BRANCH_NAME":"%s","SPEC_FILE":"%s","FEATURE_NUM":"%s","FEATURE_DIR":"%s"}\n' \
        "$(json_escape "$BRANCH_NAME")" \
        "$(json_escape "$SPEC_FILE")" \
        "$(json_escape "$FEATURE_NUM")" \
        "$(json_escape "$FEATURE_DIR")"
else
    echo "BRANCH_NAME: $BRANCH_NAME"
    echo "SPEC_FILE: $SPEC_FILE"
    echo "FEATURE_NUM: $FEATURE_NUM"
    echo "FEATURE_DIR: $FEATURE_DIR"
    echo "SPECIFY_FEATURE environment variable set to: $BRANCH_NAME"
fi
