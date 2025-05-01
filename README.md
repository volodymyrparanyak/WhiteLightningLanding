# WhiteLightning Docs and Playground

This is a [Next.js](https://nextjs.org/) project set up with Prettier and Husky for code formatting and pre-commit hooks.

## Prerequisites

- Node.js (>= 18.x)
- npm (>= 9.x) or yarn/pnpm
- Git

## Setup and Running the Project

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <project-folder>

2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   next dev
   ```
4. **Open http://localhost:3000 in your browser to view the app.**

# Contributing
To contribute, follow these steps to set up pre-commit hooks for consistent code formatting:
Run the following command to set up Husky using the provided Makefile:
```bash
make setup-husky
```