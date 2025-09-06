# Memory Bank + GitHub Copilot Integration

This repository is configured to work with Memory Bank for persistent AI context.

## How It Works

- **Repository Instructions**: `.github/copilot-instructions.md` provides project context
- **Workspace Settings**: `.vscode/settings.json` configures code generation preferences
- **Sample Prompts**: `.github/prompts/` contains reusable prompt templates

## Usage

### Effective Prompting
Reference Memory Bank files in your prompts:
```
Create a new user service following patterns in memory-bank/systemPatterns.md
```

### Memory Bank Files
- `memory-bank/productContext.md` - Project overview and architecture
- `memory-bank/activeContext.md` - Current session goals
- `memory-bank/decisionLog.md` - Architectural decisions  
- `memory-bank/progress.md` - Work completed and next steps
- `memory-bank/systemPatterns.md` - Coding patterns and standards

### Commit Messages
Copilot will automatically reference Memory Bank context for better commit messages.

### Code Reviews
Code reviews will consider established patterns and architectural decisions.

## Maintenance

Keep Memory Bank files updated for best results:
- Update progress.md as work completes
- Document decisions in decisionLog.md
- Maintain current patterns in systemPatterns.md
