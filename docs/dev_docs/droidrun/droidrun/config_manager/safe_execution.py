"""
Safe execution configuration for code executors.

This module provides configuration and utilities for restricting code execution
in CodeAct and Scripter agents. It defines which modules and builtins are allowed
or blocked when safe_execution mode is enabled.
"""

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Set

# Default safe builtins (used when allow_all_builtins=False and allowed_builtins is empty)
DEFAULT_SAFE_BUILTINS = {
    # Type constructors
    "int",
    "float",
    "str",
    "bool",
    "list",
    "dict",
    "tuple",
    "set",
    "frozenset",
    "complex",
    "bytes",
    "bytearray",
    # Iteration and inspection
    "range",
    "enumerate",
    "zip",
    "map",
    "filter",
    "sorted",
    "reversed",
    "len",
    "sum",
    "min",
    "max",
    "any",
    "all",
    # Type checking
    "type",
    "isinstance",
    "issubclass",
    "callable",
    # Attribute access
    "getattr",
    "setattr",
    "hasattr",
    "delattr",
    "dir",
    # Math
    "abs",
    "round",
    "pow",
    "divmod",
    # Output
    "print",
    "repr",
    "chr",
    "ord",
    "hex",
    "oct",
    "bin",
    "format",
    # Exceptions
    "Exception",
    "ValueError",
    "TypeError",
    "KeyError",
    "IndexError",
    "AttributeError",
    "RuntimeError",
    "StopIteration",
    "ZeroDivisionError",
    "NameError",
    "ImportError",
    # Special
    "True",
    "False",
    "None",
    "NotImplemented",
    "Ellipsis",
    # Object operations
    "object",
    "super",
    "property",
    "staticmethod",
    "classmethod",
    # Utility
    "slice",
    "hash",
    "id",
    "vars",
}


@dataclass
class SafeExecutionConfig:
    """
    Safe code execution configuration (shared by CodeAct and Scripter).

    When safe_execution is enabled in an agent, this config determines what
    modules and builtins are accessible.

    Defaults (when safe_execution=True):
    - allow_all_imports=False: No imports allowed by default
    - allow_all_builtins=False: Only DEFAULT_SAFE_BUILTINS allowed
    - Network operations blocked by default (can enable via allowed_modules)
    """

    # === Import Control ===
    # Allow all imports (takes precedence, overrides allowed_modules)
    allow_all_imports: bool = False

    # Allowed modules (empty + allow_all_imports=False = no imports allowed)
    allowed_modules: List[str] = field(default_factory=list)

    # Blocked modules (takes precedence over allowed_modules and allow_all_imports)
    blocked_modules: List[str] = field(default_factory=list)

    # === Builtin Control ===
    # Allow all builtins (takes precedence, overrides allowed_builtins)
    allow_all_builtins: bool = False

    # Allowed builtins (empty + allow_all_builtins=False = use DEFAULT_SAFE_BUILTINS)
    allowed_builtins: List[str] = field(default_factory=list)

    # Blocked builtins (takes precedence over allowed_builtins and allow_all_builtins)
    blocked_builtins: List[str] = field(default_factory=list)

    def get_allowed_modules(self) -> Optional[Set[str]]:
        """
        Get final set of allowed modules for import restriction.

        Returns:
            None if all imports allowed (allow_all_imports=True)
            Empty set if no imports allowed
            Set of allowed module names otherwise
        """
        if self.allow_all_imports:
            # All imports allowed (except blocked)
            return None

        if not self.allowed_modules:
            # No imports allowed (strict default)
            return set()

        # Only specified modules allowed
        return set(self.allowed_modules) - set(self.blocked_modules)

    def get_blocked_modules(self) -> Set[str]:
        """
        Get final set of blocked modules.

        These modules are always blocked regardless of allow_all_imports or allowed_modules.

        Returns:
            Set of blocked module names (takes precedence over all other settings)
        """
        return set(self.blocked_modules)

    def get_allowed_builtins(self) -> Optional[Set[str]]:
        """
        Get final set of allowed builtins.

        Returns:
            None if all builtins allowed (allow_all_builtins=True)
            DEFAULT_SAFE_BUILTINS if allowed_builtins is empty
            Set of allowed builtin names otherwise
        """
        if self.allow_all_builtins:
            # All builtins allowed (except blocked)
            return None

        if not self.allowed_builtins:
            # Use default safe set
            return DEFAULT_SAFE_BUILTINS - set(self.blocked_builtins)

        # Use custom allowed set
        return set(self.allowed_builtins) - set(self.blocked_builtins)

    def get_blocked_builtins(self) -> Set[str]:
        """
        Get final set of blocked builtins.

        These builtins are always blocked regardless of allow_all_builtins or allowed_builtins.

        Returns:
            Set of blocked builtin names (takes precedence over all other settings)
        """
        return set(self.blocked_builtins)


def create_safe_builtins(
    allowed_builtins: Optional[Set[str]] = None,
    blocked_builtins: Optional[Set[str]] = None,
) -> Dict[str, Any]:
    """
    Create restricted builtins dictionary.

    Args:
        allowed_builtins: Set of allowed builtins (None = allow all)
        blocked_builtins: Set of blocked builtins (takes precedence)

    Returns:
        Dictionary of safe builtins
    """
    blocked = blocked_builtins or set()

    # Get original builtins
    original_builtins = (
        __builtins__ if isinstance(__builtins__, dict) else __builtins__.__dict__
    )

    # If None, allow all except blocked
    if allowed_builtins is None:
        safe_dict = {}
        for name, value in original_builtins.items():
            if name not in blocked:
                safe_dict[name] = value
        return safe_dict

    # Otherwise, only allow specified
    safe_dict = {}
    for name in allowed_builtins:
        if name in original_builtins and name not in blocked:
            safe_dict[name] = original_builtins[name]

    return safe_dict


def create_safe_import(
    allowed_modules: Optional[Set[str]] = None,
    blocked_modules: Optional[Set[str]] = None,
):
    """
    Create a restricted __import__ function.

    Args:
        allowed_modules: Set of allowed modules (None = allow all, empty set = allow none)
        blocked_modules: Set of blocked modules (takes precedence)

    Returns:
        Restricted import function
    """
    original_import = (
        __builtins__.__import__ if hasattr(__builtins__, "__import__") else __import__
    )
    blocked = blocked_modules or set()

    def safe_import(name, globals=None, locals=None, fromlist=(), level=0):
        # Get base module name (e.g., 'os' from 'os.path')
        base_module = name.split(".")[0]

        # Check blocked list first (always enforced)
        if base_module in blocked:
            raise ImportError(
                f"Module '{name}' is blocked in safe execution mode. "
                f"Blocked modules: {', '.join(sorted(blocked))}"
            )

        # Check allowed list
        if allowed_modules is not None:
            # If allowed_modules is empty set, no imports allowed
            if not allowed_modules:
                raise ImportError(
                    f"Module '{name}' cannot be imported. No imports are allowed in safe execution mode. "
                    f"Set 'allow_all_imports: true' or add modules to 'allowed_modules' to enable imports."
                )

            # If allowed_modules is non-empty set, check membership
            if base_module not in allowed_modules:
                raise ImportError(
                    f"Module '{name}' is not in the allowed modules list. "
                    f"Allowed modules: {', '.join(sorted(allowed_modules))}"
                )

        # If allowed_modules is None, all imports allowed (except blocked)
        return original_import(name, globals, locals, fromlist, level)

    return safe_import
