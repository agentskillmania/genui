#!/usr/bin/env python3
"""
validate_a2ui.py — GenUI variant

Validate an A2UI components/dataModel pair for GenUI (React + Ant Design 6).

Historically derived from an earlier AGenUI validator; GenUI ships its own.
Key changes:
- Component allowlist expanded to 62 components
- Style validation uses camelCase CSS properties (web standard)
- Component enums match GenUI's actual property values
- Button uses `text` property (not `child` wrapper)
- Icon names use Ant Design convention (PascalCase, e.g. SearchOutlined)
- No px-only restriction for style values
- No Row max-children limit (web has ample horizontal space)

Preferred usage is importing `validate()` from Python code. A small CLI is also
provided for convenience.
"""

import json
import re
import sys
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

# =====================================================================
# Constants
# =====================================================================

STRING_PATH_KEYS = {
    "items",
    "cards",
    "contents",
    "segments",
    "tips",
    "tags",
}

PLACEHOLDER_URL_RE = re.compile(
    r"https?://(example\.com|placeholder\.com|via\.placeholder\.com|picsum\.photos|placehold\.(co|it|jp)|dummyimage\.com|fakeimg\.pl|loremflickr\.com)",
    re.IGNORECASE,
)

BUTTONISH_TEXT_PATH_RE = re.compile(
    r"(^|/)(actionText|buttonText|ctaText|linkText|actionUrl|buttonUrl|ctaUrl|linkUrl)$",
    re.IGNORECASE,
)

ALLOWED_COMPONENTS = {
    # Layout (12)
    "Column", "Row", "List", "Card", "Tabs", "Modal",
    "Carousel", "Collapse", "Space", "Splitter", "Tooltip", "Popover",
    # Basic (6)
    "Text", "Image", "Icon", "Button", "Divider", "Web",
    # Input (14)
    "TextField", "CheckBox", "ChoicePicker", "Slider", "DateTimeInput",
    "Switch", "Rate", "InputNumber", "AutoComplete", "Cascader",
    "TreeSelect", "Transfer", "Upload", "ColorPicker",
    # Data (10)
    "Table", "RichText", "Markdown", "Avatar", "Badge",
    "Statistic", "Timeline", "Descriptions", "Calendar", "Tree",
    # Feedback (7)
    "Alert", "Drawer", "Progress", "Result", "Skeleton", "Spin", "Tag",
    # Navigation (6)
    "Breadcrumb", "Steps", "Pagination", "Dropdown", "Anchor", "Menu",
    # Media (3)
    "Video", "AudioPlayer", "Lottie",
    # Utility (3)
    "QRCode", "Watermark", "FloatButton",
    # Chart (1)
    "Chart",
}

# GenUI uses standard CSS via React style objects (camelCase).
# We validate known property names but do not restrict values to px-only.
CAMEL_CASE_CSS_RE = re.compile(r"^[a-z][a-zA-Z0-9]*$")

# Properties that accept color values
COLOR_STYLE_KEYS = {
    "color", "backgroundColor", "borderColor",
    "strokeColor", "trailColor", "fontColor",
}

# Component property enums — GenUI actual values
COMPONENT_ENUMS: dict[str, dict[str, set[str]]] = {
    "Row": {
        "justify": {"start", "end", "center", "spaceAround", "spaceBetween", "spaceEvenly"},
        "align": {"top", "middle", "bottom", "stretch"},
    },
    "Text": {
        "variant": {"h1", "h2", "h3", "h4", "h5", "body", "caption"},
    },
    "Button": {
        "variant": {"primary", "default", "dashed", "link", "text"},
        "size": {"small", "middle", "large"},
    },
    "TextField": {
        "variant": {"shortText", "longText"},
    },
    "ChoicePicker": {
        "mode": {"single", "multiple"},
    },
    "Divider": {
        "orientation": {"left", "center", "right"},
        "type": {"horizontal", "vertical"},
    },
    "Progress": {
        "type": {"line", "circle", "dashboard"},
        "status": {"success", "exception", "normal", "active"},
    },
    "Result": {
        "status": {"success", "error", "info", "warning", "404", "403", "500"},
    },
    "Alert": {
        "type": {"success", "info", "warning", "error"},
    },
    "Badge": {
        "status": {"success", "processing", "error", "default", "warning"},
    },
    "Space": {
        "direction": {"horizontal", "vertical"},
        "size": {"small", "middle", "large"},
    },
    "Tabs": {
        "tabType": {"line", "card"},
        "tabPosition": {"top", "bottom", "left", "right"},
    },
    "Carousel": {
        "effect": {"scrollx", "fade"},
    },
    "Drawer": {
        "placement": {"top", "right", "bottom", "left"},
    },
    "Chart": {
        "chartType": {
            "bar", "line", "area", "pie", "donut", "scatter", "radar",
            "heatmap", "funnel", "gauge", "treemap", "sunburst",
            "sankey", "graph", "boxplot", "candlestick",
            "effectScatter", "lines", "themeRiver", "bar_grouped",
        },
    },
    "Avatar": {
        "shape": {"circle", "square"},
    },
    "Menu": {
        "mode": {"horizontal", "vertical", "inline"},
        "theme": {"light", "dark"},
    },
    "Steps": {
        "direction": {"horizontal", "vertical"},
        "status": {"wait", "process", "finish", "error"},
    },
    "FloatButton": {
        "type": {"default", "primary"},
        "shape": {"circle", "square"},
    },
    "Image": {
        "fit": {"contain", "cover", "fill", "none", "scale-down"},
    },
    "DateTimeInput": {
        "mode": {"date", "time", "datetime", "month", "year"},
    },
    "Skeleton": {
        "size": {"small", "default", "large"},
    },
    "Spin": {
        "size": {"small", "default", "large"},
    },
    "Table": {
        "size": {"small", "middle", "large"},
    },
    "Splitter": {
        "layout": {"horizontal", "vertical"},
    },
    "Tooltip": {
        "trigger": {"hover", "click", "focus"},
    },
    "Upload": {
        "listType": {"text", "picture", "picture-card"},
    },
}

# Components that require specific fields
COMPONENT_REQUIRED_FIELDS: dict[str, list[str]] = {
    "Text":       ["text"],
    "Image":      ["url"],
    "Button":     ["text"],
    "Icon":       ["name"],
    "Chart":      ["chartType"],
    "Table":      ["columns"],
    "Video":      ["url"],
    "AudioPlayer": ["url"],
    "Web":        ["url"],
    "QRCode":     ["value"],
    "Markdown":   ["content"],
}

# Ant Design icon naming convention: PascalCase with Outlined/Filled/TwoTone suffix
# We validate the pattern rather than enumerate all ~800 icons
ICON_NAME_RE = re.compile(r"^[A-Z][a-zA-Z0-9]*(Outlined|Filled|TwoTone)?$")


# =====================================================================
# Helpers
# =====================================================================

def _load_overrides(path: str | None) -> dict[str, Any]:
    if not path:
        return {
            "user_requirement_first": False,
            "allow_unsupported_styles": set(),
        }

    raw = json.loads(Path(path).read_text(encoding="utf-8"))
    user_requirement_first = bool(raw.get("userRequirementFirst"))

    allow_unsupported_styles = {
        item
        for item in raw.get("allowUnsupportedStyles", [])
        if isinstance(item, str) and item.strip()
    }

    return {
        "user_requirement_first": user_requirement_first,
        "allow_unsupported_styles": allow_unsupported_styles,
    }


def _collect_binding_paths(node: Any, location: str = "root") -> list[tuple[str, str]]:
    """Collect path-like bindings from nested JSON structures."""
    found: list[tuple[str, str]] = []

    if isinstance(node, dict):
        path_value = node.get("path")
        if isinstance(path_value, str):
            found.append((f"{location}.path", path_value))

        for key, value in node.items():
            if key in STRING_PATH_KEYS and isinstance(value, str) and value.startswith("/"):
                found.append((f"{location}.{key}", value))
            found.extend(_collect_binding_paths(value, f"{location}.{key}"))

    elif isinstance(node, list):
        for index, value in enumerate(node):
            found.extend(_collect_binding_paths(value, f"{location}[{index}]"))

    return found


# =====================================================================
# Validation functions
# =====================================================================

def _validate_binding_paths(
    comp: dict, data_root: str | None, errors: list[str]
) -> None:
    """Validate absolute/relative binding path syntax."""
    for location, path_value in _collect_binding_paths(comp, "updateComponents"):
        if not path_value:
            errors.append(f"{location}: path must not be empty")
            continue

        if "." in path_value:
            errors.append(
                f"{location}: invalid dotted path {path_value!r}; use '/' separators instead"
            )

        if path_value.startswith("/") and data_root and data_root != "/":
            if path_value != data_root and not path_value.startswith(f"{data_root}/"):
                errors.append(
                    f"{location}: absolute path {path_value!r} is outside updateDataModel.path {data_root!r}"
                )


def _validate_button_patterns(components: list[dict], errors: list[str]) -> None:
    """Validate Button action structures and detect fake buttons."""
    for component in components:
        cid = component.get("id", "")
        ctype = component.get("component", "")

        if ctype == "Button":
            action = component.get("action")
            if not isinstance(action, dict):
                # action is optional for non-interactive buttons
                continue

            has_function_call = "functionCall" in action
            has_event = "event" in action
            if has_function_call == has_event:
                errors.append(
                    f"{cid} (Button): action must contain exactly one of functionCall or event"
                )
                continue

            if has_function_call:
                function_call = action.get("functionCall")
                if not isinstance(function_call, dict) or not function_call.get("call"):
                    errors.append(
                        f"{cid} (Button): functionCall must include a non-empty call"
                    )

            if has_event:
                event = action.get("event")
                if not isinstance(event, dict) or not event.get("name"):
                    errors.append(f"{cid} (Button): event must include a non-empty name")


def _validate_component_enums(components: list[dict], errors: list[str]) -> None:
    """Validate component property enum values."""
    for component in components:
        cid = component.get("id", "<unknown>")
        ctype = component.get("component", "")
        enum_defs = COMPONENT_ENUMS.get(ctype)
        if not enum_defs:
            continue
        for attr_name, allowed_values in enum_defs.items():
            value = component.get(attr_name)
            if value is None:
                continue
            if not isinstance(value, str):
                errors.append(
                    f"{cid} ({ctype}): {attr_name} must be a string, got {type(value).__name__}"
                )
                continue
            if value not in allowed_values:
                errors.append(
                    f"{cid} ({ctype}): {attr_name} value {value!r} "
                    f"is not valid; allowed: {sorted(allowed_values)}"
                )


def _validate_required_fields(components: list[dict], errors: list[str]) -> None:
    """Validate that components have their required fields."""
    for component in components:
        cid = component.get("id", "<unknown>")
        ctype = component.get("component", "")
        required = COMPONENT_REQUIRED_FIELDS.get(ctype)
        if not required:
            continue
        for field in required:
            if field not in component:
                errors.append(f"{cid} ({ctype}): missing required field '{field}'")


def _validate_style_keys(
    components: list[dict], overrides: dict[str, Any], errors: list[str]
) -> None:
    """Validate style property names are valid camelCase CSS.

    GenUI uses standard CSS via React style objects, so we only validate
    that style keys look like valid camelCase CSS properties — we do not
    restrict to a fixed allowlist like the mobile variant.
    """
    user_requirement_first = overrides.get("user_requirement_first", False)
    allowed_extra_keys = overrides.get("allow_unsupported_styles", set())

    for component in components:
        cid = component.get("id", "<unknown>")
        styles = component.get("style")
        if not isinstance(styles, dict):
            continue

        for style_key, style_value in styles.items():
            # Allow vendor prefixes and custom properties
            if style_key.startswith("-") or style_key.startswith("--"):
                continue

            # Must look like camelCase CSS property
            if not CAMEL_CASE_CSS_RE.match(style_key):
                errors.append(
                    f"{cid}: style key {style_key!r} is not valid camelCase CSS"
                )
                continue

            # Color validation for known color properties
            if style_key in COLOR_STYLE_KEYS and isinstance(style_value, str):
                stripped = style_value.strip()
                if not _is_valid_css_color(stripped):
                    errors.append(
                        f"{cid}: {style_key} value {style_value!r} does not look "
                        f"like a valid CSS color"
                    )


def _is_valid_css_color(value: str) -> bool:
    """Check if a string looks like a valid CSS color value."""
    if re.match(r"^#[0-9a-fA-F]{3,8}$", value):
        return True
    if re.match(r"^rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+", value):
        return True
    if re.match(r"^hsla?\(", value):
        return True
    if value in ("transparent", "inherit", "initial", "unset", "currentColor"):
        return True
    # Named colors — don't enumerate all ~150, just accept lowercase words
    if re.match(r"^[a-z]+$", value):
        return True
    return False


# =====================================================================
# Warnings
# =====================================================================

def collect_warnings(comp: dict) -> list[str]:
    """Collect non-fatal warnings about component structure."""
    warnings: list[str] = []
    components = comp.get("updateComponents", {}).get("components", [])

    for component in components:
        cid = component.get("id", "<unknown>")
        ctype = component.get("component", "")

        if ctype == "Chart":
            if "height" not in component:
                chart_type = component.get("chartType", "")
                warnings.append(
                    f"{cid} (Chart): no height specified; "
                    f"Chart needs an explicit height value (e.g. height: 400)"
                )

    return warnings


def _collect_all_urls(node: Any, path: str = "") -> list[tuple[str, str]]:
    """Walk a data value tree and collect all URL strings."""
    found: list[tuple[str, str]] = []
    if isinstance(node, str) and re.match(r"https?://", node, re.IGNORECASE):
        found.append((path, node))
    elif isinstance(node, dict):
        for k, v in node.items():
            found.extend(_collect_all_urls(v, f"{path}/{k}"))
    elif isinstance(node, list):
        for i, v in enumerate(node):
            found.extend(_collect_all_urls(v, f"{path}[{i}]"))
    return found


def _check_url_reachable(url: str, timeout: int = 5) -> tuple[bool, str]:
    """Send HTTP GET request with Range header to verify URL serves real media."""
    try:
        req = Request(url, method="GET")
        req.add_header("User-Agent", "GenUI-A2UI-Validator/1.0")
        req.add_header("Range", "bytes=0-1023")
        with urlopen(req, timeout=timeout) as resp:
            if resp.status >= 400:
                return False, f"HTTP {resp.status}"
            ct = resp.headers.get("Content-Type", "")
            if ct.startswith("text/html"):
                return False, "server returned HTML instead of media (likely soft 404)"
            return True, ""
    except HTTPError as e:
        return False, f"HTTP {e.code}"
    except URLError as e:
        return False, str(e.reason)
    except Exception as e:
        return False, str(e)


def collect_data_warnings(data: dict) -> list[str]:
    """Warn about placeholder or unreachable URLs in updateDataModel values."""
    warnings: list[str] = []
    value = data.get("updateDataModel", {}).get("value", {})
    url_entries = _collect_all_urls(value)
    if not url_entries:
        return warnings

    unreachable_count = 0
    for data_path, url in url_entries:
        if PLACEHOLDER_URL_RE.search(url):
            warnings.append(
                f"dataModel{data_path}: placeholder URL detected ({url}); "
                f"URLs must be real and loadable — omit the component if no real URL is available"
            )
            unreachable_count += 1
            continue

        ok, reason = _check_url_reachable(url)
        if not ok:
            unreachable_count += 1
            warnings.append(
                f"dataModel{data_path}: URL unreachable ({url}); {reason} — "
                f"the resource may fail to load at runtime"
            )

    if unreachable_count == len(url_entries) and len(url_entries) >= 2:
        warnings.append(
            "all URLs in dataModel are unreachable — you may be offline; "
            "re-run with network access to get accurate results"
        )

    return warnings


# =====================================================================
# Main validation entry point
# =====================================================================

def validate(comp: dict, data: dict, overrides: dict[str, Any] | None = None) -> list[str]:
    """Return validation errors for an A2UI JSON pair."""
    errors: list[str] = []
    overrides = overrides or {
        "user_requirement_first": False,
        "allow_unsupported_styles": set(),
    }

    # Version check
    for label, payload in [("updateComponents", comp), ("updateDataModel", data)]:
        if payload.get("version") != "v0.9":
            errors.append(f"{label}: version must be 'v0.9', got {payload.get('version')!r}")

    # Surface ID consistency
    comp_sid = comp.get("updateComponents", {}).get("surfaceId", "")
    data_sid = data.get("updateDataModel", {}).get("surfaceId", "")
    if not comp_sid:
        errors.append("updateComponents: missing surfaceId")
    if not data_sid:
        errors.append("updateDataModel: missing surfaceId")
    if comp_sid and data_sid and comp_sid != data_sid:
        errors.append(f"surfaceId mismatch: components={comp_sid}, dataModel={data_sid}")

    components = comp.get("updateComponents", {}).get("components", [])
    if not components:
        errors.append("updateComponents: components array is empty")
        return errors

    # Component-level validation
    ids = set()
    referenced_ids = set()
    has_root = False

    for component in components:
        cid = component.get("id", "")
        ctype = component.get("component", "")

        # Unknown component check
        if ctype and ctype not in ALLOWED_COMPONENTS:
            errors.append(
                f"{cid or '?'}: unknown component '{ctype}'; "
                f"not in the GenUI component catalog"
            )

        if not cid:
            preview = json.dumps(component, ensure_ascii=False)[:120]
            errors.append(f"component missing id: {preview}")
            continue

        if cid in ids:
            errors.append(f"duplicate component id: {cid}")
        ids.add(cid)

        if cid == "root":
            has_root = True

        # Component-specific field checks
        if ctype == "Text" and "text" not in component:
            errors.append(f"{cid} (Text): missing text")
        if ctype == "Image" and "url" not in component:
            errors.append(f"{cid} (Image): missing url")

        # Collect referenced child IDs
        child = component.get("child")
        if isinstance(child, str) and child:
            referenced_ids.add(child)

        children = component.get("children")
        if isinstance(children, list):
            for item in children:
                if isinstance(item, str) and item:
                    referenced_ids.add(item)
        elif isinstance(children, dict):
            ref_id = children.get("componentId")
            if isinstance(ref_id, str) and ref_id:
                referenced_ids.add(ref_id)

        # Icon name pattern check (Ant Design convention)
        if ctype == "Icon":
            name = component.get("name")
            if isinstance(name, str) and not ICON_NAME_RE.match(name):
                errors.append(
                    f"{cid} (Icon): name {name!r} does not match Ant Design "
                    f"icon convention (PascalCase, e.g. SearchOutlined, UserFilled)"
                )

    if not has_root:
        errors.append("missing root component with id='root'")

    missing = referenced_ids - ids
    if missing:
        errors.append(f"undefined referenced component ids: {sorted(missing)}")

    # Data model validation
    data_model = data.get("updateDataModel", {})
    if "path" not in data_model:
        errors.append("updateDataModel: missing path")
    if "value" not in data_model:
        errors.append("updateDataModel: missing value")

    data_root = data_model.get("path")
    if isinstance(data_root, str):
        if not data_root.startswith("/"):
            errors.append(f"updateDataModel.path must start with '/', got {data_root!r}")
        if "." in data_root:
            errors.append(
                f"updateDataModel.path uses dotted syntax {data_root!r}; use '/' separators instead"
            )
    else:
        data_root = None

    # Run sub-validators
    _validate_binding_paths(comp, data_root, errors)
    _validate_button_patterns(components, errors)
    _validate_style_keys(components, overrides, errors)
    _validate_component_enums(components, errors)
    _validate_required_fields(components, errors)

    return errors


# =====================================================================
# CLI
# =====================================================================

def extract_json_blocks(text: str) -> list[dict]:
    """Extract JSON code fences from markdown-like text."""
    pattern = r"```(?:json)?\s*\n(.*?)\n\s*```"
    blocks = re.findall(pattern, text, re.DOTALL)
    parsed = []
    for block in blocks:
        try:
            parsed.append(json.loads(block.strip()))
        except json.JSONDecodeError:
            continue
    return parsed


def load_payloads(path1: str, path2: str | None = None) -> tuple[dict, dict]:
    """Load payloads from one markdown file or two JSON files."""
    if path2 is None:
        text = Path(path1).read_text(encoding="utf-8")
        blocks = extract_json_blocks(text)
        if len(blocks) < 2:
            raise ValueError("could not extract two JSON blocks from the input file")
        return blocks[0], blocks[1]

    with open(path1, "r", encoding="utf-8") as f:
        comp = json.load(f)
    with open(path2, "r", encoding="utf-8") as f:
        data = json.load(f)
    return comp, data


def main() -> int:
    if len(sys.argv) not in (2, 3, 4):
        print("Usage: python validate_a2ui.py <combined.md>")
        print("   or: python validate_a2ui.py <components.json> <datamodel.json>")
        print("Optional:")
        print("   python validate_a2ui.py <combined.md> <overrides.json>")
        print("   python validate_a2ui.py <components.json> <datamodel.json> <overrides.json>")
        return 1

    try:
        overrides: dict[str, Any] = {
            "user_requirement_first": False,
            "allow_unsupported_styles": set(),
        }

        if len(sys.argv) == 2:
            comp, data = load_payloads(sys.argv[1])
        elif len(sys.argv) == 3:
            if sys.argv[1].endswith(".md"):
                comp, data = load_payloads(sys.argv[1])
                overrides = _load_overrides(sys.argv[2])
            else:
                comp, data = load_payloads(sys.argv[1], sys.argv[2])
        else:
            if sys.argv[1].endswith(".md"):
                comp, data = load_payloads(sys.argv[1])
                overrides = _load_overrides(sys.argv[2])
            else:
                comp, data = load_payloads(sys.argv[1], sys.argv[2])
                overrides = _load_overrides(sys.argv[3])
    except Exception as exc:  # pragma: no cover
        print(f"Failed to load input: {exc}")
        return 1

    errors = validate(comp, data, overrides=overrides)
    if errors:
        print(f"Found {len(errors)} problem(s):")
        for error in errors:
            print(f" - {error}")
        return 1

    warnings = collect_warnings(comp) + collect_data_warnings(data)
    if warnings:
        print(f"Found {len(warnings)} warning(s):")
        for warning in warnings:
            print(f" - {warning}")

    count = len(comp.get("updateComponents", {}).get("components", []))
    surface_id = comp.get("updateComponents", {}).get("surfaceId", "N/A")
    print("A2UI validation passed (GenUI)")
    print(f"components: {count}")
    print(f"surfaceId: {surface_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
