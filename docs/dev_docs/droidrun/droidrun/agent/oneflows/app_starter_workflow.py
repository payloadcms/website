"""
Simple workflow to open an app based on a description.
"""

import json

from workflows import Context, Workflow, step
from workflows.events import StartEvent, StopEvent

from droidrun.tools.tools import Tools


class AppStarter(Workflow):
    """
    A simple workflow that opens an app based on a description.

    The workflow uses an LLM to intelligently match the app description
    to an installed app's package name, then opens it.
    """

    def __init__(self, tools: Tools, llm, timeout: int = 60, **kwargs):
        """
        Initialize the OpenAppWorkflow.

        Args:
            tools: An instance of Tools (e.g., AdbTools) to interact with the device
            llm: An LLM instance (e.g., OpenAI) to determine which app to open
            timeout: Workflow timeout in seconds (default: 60)
            **kwargs: Additional arguments passed to Workflow
        """
        super().__init__(timeout=timeout, **kwargs)
        self.tools = tools
        self.llm = llm

    @step
    async def open_app_step(self, ev: StartEvent, ctx: Context) -> StopEvent:
        """
        Opens an app based on the provided description.

        Expected StartEvent attributes:
            - app_description (str): The name or description of the app to open

        Returns:
            StopEvent with the result of the open_app operation
        """
        app_description = ev.app_description

        # Get list of installed apps
        apps = await self.tools.get_apps(include_system=True)

        # Format apps list for LLM
        apps_list = "\n".join(
            [f"- {app['label']} (package: {app['package']})" for app in apps]
        )

        # Construct prompt for LLM
        prompt = f"""Given the following list of installed apps and a user's description, determine which app package name to open.

Installed Apps:
{apps_list}

User's Request: "{app_description}"

Return ONLY a JSON object with the following structure:
{{
    "package": "com.example.package"
}}

Choose the most appropriate app based on the description. Return the package name of the best match."""

        # Get LLM response
        response = await self.llm.acomplete(prompt)
        response_text = str(response).strip()

        # Parse JSON response - extract content between { and }
        try:
            start = response_text.find("{")
            end = response_text.rfind("}") + 1
            json_str = response_text[start:end]
            result_json = json.loads(json_str)
            package_name = result_json["package"]
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            return StopEvent(
                result=f"Error parsing LLM response: {e}. Response: {response_text}"
            )

        result = await self.tools.start_app(package_name)

        return StopEvent(result=result)


# Example usage
async def main():
    """
    Example of how to use the OpenAppWorkflow.
    """
    from llama_index.llms.openai import OpenAI

    from droidrun.tools.adb import AdbTools

    # Initialize tools with device serial (None for default device)
    tools = AdbTools(serial=None)

    # Initialize LLM
    llm = OpenAI(model="gpt-4o-mini")

    # Create workflow instance
    workflow = AppStarter(tools=tools, llm=llm, timeout=60, verbose=True)

    # Run workflow to open an app
    result = await workflow.run(app_description="Settings")

    print(f"Result: {result}")


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
