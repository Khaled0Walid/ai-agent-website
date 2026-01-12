# Automation Agency Agent System

This repository follows the **3-Layer Agent Architecture** defined in `AGENTS.md`.

## Structure

1.  **Directives (`directives/`)**:
    *   Markdown files containing Standard Operating Procedures (SOPs).
    *   These are the "Manager's instructions".

2.  **Execution (`execution/`)**:
    *   Python scripts that perform deterministic actions.
    *   These are the "Worker's tools".

3.  **Intermediate (`.tmp/`)**:
    *   Temporary storage for files generated during execution.
    *   **Always gitignored.**

## Quick Start

1.  **Create a Directive**:
    *   Write a new `.md` file in `directives/` describing the task.
2.  **Check/Create Tools**:
    *   Look in `execution/` for existing scripts.
    *   If needed, write a new Python script to handle the specific logic.
3.  **Run**:
    *   The agent (you) reads the directive and executes the scripts.

## Example

See `directives/example_echo.md` and `execution/echo_tool.py`.
