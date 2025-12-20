"""Filter full accessibility tree to visible elements."""

from typing import Dict, List, Any


def filter_a11y_tree_to_interactive_elements(
    root_node: Dict[str, Any], device_context: Dict[str, Any]
) -> List[Dict[str, Any]]:
    """Filter full a11y tree using device context from Android."""
    screen_bounds = device_context.get("screen_bounds", {})
    filtering_params = device_context.get("filtering_params", {})

    screen_width = screen_bounds.get("width", 1080)
    screen_height = screen_bounds.get("height", 2400)
    min_size = filtering_params.get("min_element_size", 5)

    index_counter = [1]

    def traverse(
        node: Dict[str, Any], parent_element: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        results = []
        bounds = node.get("boundsInScreen", {})

        in_bounds = _is_in_screen_bounds(bounds, screen_width, screen_height)
        min_size_ok = _has_minimum_size(bounds, min_size)
        interactive = _is_interactive_element(node)

        current_element = None

        if in_bounds and min_size_ok and interactive:
            class_name = node.get("className", "")
            short_class = class_name.split(".")[-1] if "." in class_name else class_name

            current_element = {
                "index": index_counter[0],
                "resourceId": node.get("resourceId", ""),
                "className": short_class,
                "text": _get_display_text(node),
                "bounds": _format_bounds_string(bounds),
                "children": [],
            }

            index_counter[0] += 1
            results.append(current_element)

        for child in node.get("children", []):
            child_results = traverse(child, current_element)

            if current_element is not None:
                current_element["children"].extend(child_results)
            else:
                results.extend(child_results)

        return results

    return traverse(root_node)


def _is_in_screen_bounds(
    bounds: Dict[str, int], screen_width: int, screen_height: int
) -> bool:
    left = bounds.get("left", 0)
    top = bounds.get("top", 0)
    right = bounds.get("right", 0)
    bottom = bounds.get("bottom", 0)

    return not (right < 0 or bottom < 0 or left > screen_width or top > screen_height)


def _has_minimum_size(bounds: Dict[str, int], min_size: int) -> bool:
    width = bounds.get("right", 0) - bounds.get("left", 0)
    height = bounds.get("bottom", 0) - bounds.get("top", 0)
    return width > min_size and height > min_size


def _is_interactive_element(
    node: Dict[str, Any],
) -> bool:  # possiblity for filtering out non-interactive elements
    return True


def _get_display_text(node: Dict[str, Any]) -> str:
    text = node.get("text", "")
    if text:
        return text

    content_desc = node.get("contentDescription", "")
    if content_desc:
        return content_desc

    resource_id = node.get("resourceId", "")
    if resource_id and "/" in resource_id:
        return resource_id.split("/")[-1]

    class_name = node.get("className", "")
    if class_name and "." in class_name:
        return class_name.split(".")[-1]

    return class_name


def _format_bounds_string(bounds: Dict[str, int]) -> str:
    return f"{bounds['left']}, {bounds['top']}, {bounds['right']}, {bounds['bottom']}"
