# Contributing Guidelines

Thanks for contributing! This project is developed by team **310-Group-7** and is associated with the University of Auckland **SOFTENG 310** course. These guidelines describe the workflow every contributor is expected to follow.

> Please read this document fully before making your first contribution.

---

## Tech stack

- **Frontend:** React + Vite
- **Styling:** TailwindCSS
- **Backend / database:** Supabase
- **Package manager:** npm

---

## Getting set up

1. **Fork** the upstream repository (`Tech-A/<repo>`) to your own GitHub account.
2. **Clone** your fork locally:
    
    ```bash
    git clone https://github.com/<your-username>/<repo>.gitcd <repo>
    ```
    
3. Add the upstream repo as a remote so you can stay in sync:
    
    ```bash
    git remote add upstream https://github.com/Tech-A/<repo>.git
    ```
    
4. Install dependencies:
    
    ```bash
    npm install
    ```
    
5. Create a `.env` file in the project root (see `.env.example`) with the required Supabase keys:
    
    ```
    VITE_SUPABASE_URL=your-project-urlVITE_SUPABASE_ANON_KEY=your-anon-key
    ```
    
    > The `.env` file is git-ignored. Never commit secrets. Required keys are submitted separately on Canvas as per the assignment brief.
    
6. Run the app:
    
    ```bash
    npm run dev
    ```
    

---

## The contribution workflow (required)

Every change — **code or documentation** — follows this loop:

1. **Find or open an issue.** All work must be tied to an open issue. If one doesn't exist, create it first (see _Issues_ below) and wait for it to be approved.
2. **Claim the issue.** Assign yourself, or comment and have a maintainer assign you. You may only have **one claimed open issue at a time**.
3. **Sync and branch.** Update your fork from upstream, then create a feature branch from `main` on **your fork**:
    
    ```bash
    git fetch upstream
    git checkout maingit rebase upstream/main
    git checkout -b <branch-name>
    ```
    
4. **Make your changes**, committing in logical steps. Rebase often against `upstream/main` — don't wait until the end.
5. **Add tests.** All code additions or modifications must include associated tests, and all existing + new tests must pass before you open a PR.
6. **Run it.** Confirm the app builds and works as expected.
7. **Open a pull request** from your fork's branch to `Tech-A/main` (see _Pull requests_ below).
8. **Get it reviewed.** At least one other team member must review and approve.
9. **Merge.** Once approved, squash commits, resolve any conflicts, and merge (see _Merge access_). **Never merge without approval.**

---

## Branch naming

Use a consistent, descriptive scheme:

```
<type>/<short-description>
```

Examples: `feature/application-list`, `fix/login-redirect`, `docs/contributor-guidelines`. Common types: `feature`, `fix`, `docs`, `refactor`, `test`.

---

## Commits and pull requests

- **PR title** should succinctly describe the _change_ — not just the issue number. ✅ `Add application status filter` / ❌ `#42`.
- **PR body** should explain what changed and reference the issue, e.g. `Adds status filtering to the applications list. Closes #42.`
- **Squash** your commits and **resolve merge conflicts** before merging.
- If more than one person worked on the issue, note this in the issue and PR comments and list all contributors on the wiki.

---

## Issues

### Creating an issue

- Check open issues first to avoid duplicates.
- Use the **bug report** or **feature request** template.
- Apply appropriate **labels** (see below).
- Flag any dependencies in a comment, e.g. `Depends on #12` or `Blocks #15`.

### Getting an issue approved

New issues must be **approved by the team before anyone starts work**. Approval checks that the issue is reproducible (bugs) or appropriate (features), isn't a duplicate, and has dependencies flagged.

> **[Team to confirm]** Our approval process: a new issue is approved once **at least [N] team members comment their approval**, or it is discussed and approved at the weekly group meeting. Adjust this line to match what your team agreed.

### Labels

We use the default GitHub labels plus the following custom labels:

|Label|Meaning|
|---|---|
|`frontend`|React / UI work|
|`backend`|Supabase / data-layer work|
|`documentation`|Docs, wiki, guidelines|
|`A2`|Work scoped for the next iteration (Assignment 2)|

> **[Team to confirm]** Edit this table to reflect the labels you actually use. Any custom label beyond GitHub's defaults must be listed here.

---

## Code reviews

All pull requests must be reviewed by **at least one other team member**. As a reviewer you should:

- Run the test suite.
- Run the code and confirm it works as expected.
- Check the code is clear, commented, and maintainable.

If you find bugs or issues during review, they should be fixed before the PR is approved (no new issue needed for these). Reviews should be **constructive**.

---

## Code quality and security

- **SonarLint (in-IDE):** run analysis while writing code.
- **SonarCloud (main branch):** analysis runs after contributions are merged.
- **Snyk:** monitors dependencies and opens PRs for vulnerabilities (one PR per vulnerability). Merge these where practical.
- **Dependencies:** declare all external dependencies in `package.json`. Don't add dependencies ad hoc without the team's awareness.

---

## Merge access

> **[Team to confirm]** State who can merge. For example: _"All contributors may merge their own PRs once approved by a reviewer,"_ **or** _"Only [names] have merge access; ping them once your PR is approved."_ This must match what your team agreed and is documented here as required.

---

## Coordination

- All coordination happens via **issue and pull request comments**.
- The team meets **weekly**; any decisions about how the project is managed are recorded in the project documentation, and decisions about a specific issue/PR/commit are recorded as a comment there (noting it came from the meeting).
- If you spot anything that isn't fostering an inclusive environment, or an issue the team can't easily resolve, raise it with the teaching team promptly.

---
## Made a mistake?

If you slip on the workflow while learning it, that's okay — note it on the **Workflow Retrospective** wiki page (what happened, why, and how it was fixed) rather than hiding it.
