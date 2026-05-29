# Skill Registry — Catalogo Web de Tecnologia

Last updated: 2026-05-28

## Project Conventions

| File                                          | Description                                                                              |
| --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [AGENTS.md](../AGENTS.md)                     | Agent instructions — build commands, code style, architecture, patterns, Engram protocol |
| [PRD/PRD-CATALOGO.md](../PRD/PRD-CATALOGO.md) | Product Requirements Document — full scope, tech stack, architecture, visual guidelines  |

## Available Skills

### User Skills (opencode)

| Skill                        | Trigger                                                      | Description                                                      |
| ---------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------- |
| `apply-mui-responsive-fixes` | "aplicar responsive", "responsive fixes", "hacer responsive" | Aplica correcciones de responsividad MUI para pantallas pequeñas |
| `branch-pr`                  | creating a pull request, opening a PR                        | PR creation workflow for Agent Teams Lite                        |
| `code-documentation`         | writing JSDoc, comments, or code documentation               | Guía para escribir documentación de código clara                 |
| `find-skills`                | "how do I do X", "find a skill for X"                        | Discover and install agent skills                                |
| `git-commit-wizard`          | "revisar cambios", "crear commits", "commits pendientes"     | Revisa cambios pendientes y crea commits descriptivos            |
| `go-testing`                 | writing Go tests, teatest, adding test coverage              | Go testing patterns for Gentleman.Dots                           |
| `issue-creation`             | creating a GitHub issue, reporting a bug                     | Issue creation workflow for Agent Teams Lite                     |
| `judgment-day`               | "judgment day", "dual review", "doble review"                | Parallel adversarial review protocol                             |
| `skill-creator`              | creating a new skill, add agent instructions                 | Creates new AI agent skills                                      |
| `skill-registry`             | "update skills", "skill registry", "actualizar skills"       | Create or update the skill registry                              |

### SDD Skills (orchestrator-dispatched)

| Skill         | Description                           |
| ------------- | ------------------------------------- |
| `sdd-init`    | Initialize SDD in a project           |
| `sdd-explore` | Explore and investigate ideas         |
| `sdd-propose` | Create a change proposal              |
| `sdd-spec`    | Write specifications                  |
| `sdd-design`  | Create technical design               |
| `sdd-tasks`   | Break down into implementation tasks  |
| `sdd-apply`   | Implement tasks                       |
| `sdd-verify`  | Validate implementation against specs |
| `sdd-archive` | Archive completed change              |
| `sdd-onboard` | Guided SDD walkthrough                |

## Registration Notes

- SDD skills (`sdd-*`), `_shared`, and `skill-registry` excluded from trigger listing per convention.
- Project-level conventions scanned from repository root.
