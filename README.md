# Pipeline — Internship Application Tracker

Pipeline is a web app that helps students manage their internship applications in one place — tracking progress, organizing key documents, and streamlining the whole application process.

## Why Pipeline?

There aren't many well-known platforms that let students easily or intuitively manage their internship applications. Spreadsheet options exist, but they're time-consuming to set up, unappealing, confusing to navigate, and often demotivating to look at. As students, we've also found that tailoring cover letters and CVs for each application is tiresome and repetitive.

Pipeline solves this by tracking internship progress **and** collating important documents into a single location — making the application process faster and smoother.

## Features

### Core Features
- **User Authentication** — secure sign-up and login
- **Document Management** — store resumes (tailored per role), cover letters, and transcripts
- **Application Status Tracking** — kanban board view (In Progress, Accepted, Rejected)

### Planned Features
- **Interview Calendar** — schedule and track upcoming interviews
- **Task Management** — keep on top of application-related to-dos
- **Notifications/Reminders** — never miss a deadline
- **Job Search & Filtering** — find relevant internships
- **Job Analytics** — insights into your application progress
- **Saved Internships** — bookmark roles to apply to later
- **AI Cover Letter / CV Tailorer** — automatically tailor documents per application

## Tech Stack

- **Frontend:** React + Vite
- **Styling:** TailwindCSS
- **Backend / database:** Supabase
- **Package manager:** npm

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) and npm installed
- A [Supabase](https://supabase.com/) account/project set up

### Installation

1. Clone the repository:

```bash
    git clone https://github.com/Tech-A/310-Group-7.git
    cd 310-Group-7
```

2. Install dependencies:

```bash
    npm install
```

3. Create a `.env` file in the project root (see `.env.example`) with the required Supabase keys:
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key

> The `.env` file is git-ignored. Never commit secrets. Required keys are submitted separately on Canvas as per the assignment brief.

4. Run the app:

```bash
    npm run dev
```

### Testing

```bash
    npm run test
```

### Deployment

Pipeline is deployed using [Netlify](https://www.netlify.com/).

**Live Site:** [https://pipeline.netlify.app](https://pipeline.netlify.app) *(update with your actual Netlify URL)*

- The `main` branch is connected to Netlify and automatically deploys on every push/merge.
- Pull request previews are automatically generated for review before merging (if enabled).

**Build settings:**
| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |

**Environment variables:** set the same keys used locally (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) under **Netlify → Site settings → Environment variables**.

## License

This project is licensed under the terms described in [LICENSE](./LICENSE).

## Versioning

This project is currently in early development (pre-release). No stable versions have been tagged yet.
*(Once you start tagging releases, list them here or link to the [Releases](https://github.com/Tech-A/310-Group-7/releases) page.)*

## Getting Help

If you run into issues or have questions:
- Open an [issue](https://github.com/Tech-A/310-Group-7/issues) on this repository

## Contributing

Want to contribute code? See [CONTRIBUTING.md](./CONTRIBUTING.md) for the fork/branch/PR workflow and guidelines.

## Code of Conduct

Please review our [Code of Conduct](./CODE_OF_CONDUCT.md) before participating.

## Acknowledgements

**Contributors:**
- Abbey Martinez (amar379@aucklanduni.ac.nz)
- Caitlin Kuan (ckua141@aucklanduni.ac.nz)
- Navini Ariyasinghe (kari487@aucklanduni.ac.nz)
- Julianne Gabas (jgab318@aucklanduni.ac.nz)
- Alyza So (aso060@aucklanduni.ac.nz)
- Orion Lim (olim735@aucklanduni.ac.nz)

**Built with:**
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Color palette

The project's color palette lives in [`src/styles/preset.css`](src/styles/preset.css), imported by `src/index.css`. Tailwind v4 doesn't have a JS `theme.extend` config, so the palette is defined with Tailwind's CSS-based `@theme` equivalent, which generates matching utility classes (e.g. `bg-brand-blue`, `text-brand-pink`).

| Name   | Utility prefix | Hex       |
| ------ | --------------- | --------- |
| Blue   | `brand-blue`    | `#A6C2D2` |
| Pink   | `brand-pink`    | `#D9BFB1` |
| Green  | `brand-green`   | `#B8D2C7` |
| Yellow | `brand-yellow`  | `#F5E0AE` |
| Black  | `brand-black`   | `#615F5F` |
| Background | `brand-bg`  | `#F4F4F2` |

Example usage: `<div className="bg-brand-bg text-brand-black">`.
