### Before Every Change
1. Check if the change affects other components, files, or elements in the project.
2. If yes — update ALL related files in the same commit.
3. Never break existing functionality when adding new features.
4. Always check all 4 language files when touching any text.

### After Every Change
- After making code changes, run the relevant local verification step (`npm run dev` for interactive verification, `npm run build` before commit/push, and any targeted checks needed for the changed scope).
- **After every feature, fix, or significant change — update the relevant project documentation**:
- Update the appropriate file in `/docs/` if rules, architecture, workflow, or standards changed.
- Update `docs/backlog.md` for progress, session summary, and next tasks when applicable.
- Update `Claude.md` only if the project index, global context, or documentation map changed.

### Deploy Command
- When the user says "deploy", prepare the current branch for deployment: commit the relevant changes, push the branch to GitHub, and merge to `main` only through the project's approved workflow.

### Commit Rules
- One logical change per commit.
- Commit message format: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- Always include related file changes in the same commit.
- Never commit broken code — run `npm run build` before pushing.

### Localization (i18n) Rules
- ALWAYS check `messages/sq.json`, `messages/en.json`, `messages/uk.json`, `messages/it.json`.
- Every new text string must be added to ALL four language files simultaneously.
- Never hardcode text strings in components — always use `useTranslations()`.
- Keys must be added under correct namespace (nav, listing, auth, common).
- Default language is Albanian (sq) — always write Albanian text first.

### Git Rules
- Do not commit directly to `main` unless the current project workflow explicitly allows it; prefer feature branches and merge through the approved deployment flow.
- Commit often with small logical changes.
- Never commit: `.env` files, `node_modules`, `.next` folder.
- Tag releases: `v0.1.0`, `v0.2.0` etc.