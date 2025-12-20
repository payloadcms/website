from pydantic import BaseModel, ConfigDict, Field
from typing import List, Dict


class DroidAgentState(BaseModel):
    """
    State model for DroidAgent workflow - shared across parent and child workflows.
    """

    model_config = ConfigDict(arbitrary_types_allowed=True)
    # Task context
    instruction: str = ""
    step_number: int = 0
    # App Cards
    app_card: str = ""
    # Formatted device state for prompts (complete text)
    formatted_device_state: str = ""

    # Focused element text
    focused_text: str = ""

    # Raw device state components (for access to raw data)
    a11y_tree: List[Dict] = Field(default_factory=list)
    phone_state: Dict = Field(default_factory=dict)

    # Private fields
    current_package_name: str = ""
    current_activity_name: str = ""
    visited_packages: set = Field(default_factory=set)
    visited_activities: set = Field(default_factory=set)

    # Previous device state (for before/after comparison in Manager)
    previous_formatted_device_state: str = ""

    # Screen dimensions and screenshot
    width: int = 0
    height: int = 0
    screenshot: str | bytes | None = None

    # Text manipulation flag
    has_text_to_modify: bool = False

    # Action tracking
    action_pool: List[Dict] = Field(default_factory=list)
    action_history: List[Dict] = Field(default_factory=list)
    summary_history: List[str] = Field(default_factory=list)
    action_outcomes: List[bool] = Field(default_factory=list)  # "A", "B", "C"
    error_descriptions: List[str] = Field(default_factory=list)

    # Last action info
    last_action: Dict = Field(default_factory=dict)
    last_summary: str = ""
    last_action_thought: str = ""

    # Memory
    memory: str = ""
    message_history: List[Dict] = Field(default_factory=list)

    # Planning
    plan: str = ""
    current_subgoal: str = ""
    finish_thought: str = ""
    progress_status: str = ""
    manager_answer: str = ""  # For answer-type tasks

    # Error handling
    error_flag_plan: bool = False
    err_to_manager_thresh: int = 2
    user_id: str | None = None
    # Script execution tracking
    scripter_history: List[Dict] = Field(default_factory=list)
    last_scripter_message: str = ""
    last_scripter_success: bool = True

    text_manipulation_history: List[Dict] = Field(default_factory=list)
    last_text_manipulation_success: bool = False

    output_dir: str = ""

    # Custom variables (user-defined)
    custom_variables: Dict = Field(default_factory=dict)

    def update_current_app(self, package_name: str, activity_name: str):
        """
        Update package and activity together, capturing telemetry event only once.

        This prevents duplicate PackageVisitEvents when both package and activity change.
        """
        # Check if either changed
        package_changed = package_name != self.current_package_name
        activity_changed = activity_name != self.current_activity_name

        if not (package_changed or activity_changed):
            return  # No change, nothing to do

        # Update tracking sets
        if package_changed and package_name:
            self.visited_packages.add(package_name)
        if activity_changed and activity_name:
            self.visited_activities.add(activity_name)

        # Update values
        self.current_package_name = package_name
        self.current_activity_name = activity_name

        # Capture telemetry event for any change
        # This ensures we track when apps close or transitions to empty state occur
        from droidrun.telemetry import PackageVisitEvent, capture

        capture(
            PackageVisitEvent(
                package_name=package_name or "Unknown",
                activity_name=activity_name or "Unknown",
                step_number=self.step_number,
            ),
            user_id=self.user_id,
        )
