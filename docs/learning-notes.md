# Software Engineering Learning Notes

These notes summarize important concepts I learned while building the Airport Operations Control System (AOCS).

---

# Git

## What is Git?

Git is a Version Control System (VCS).

Instead of creating files like:

- project_final
- project_final2
- project_final_REAL

Git stores snapshots of the project over time.

This allows developers to:

- track changes
- collaborate with others
- restore previous versions
- understand project history

---

# Git Repository

Running:

```bash
git init
```

creates a hidden `.git` folder.

This folder stores the complete history of the project.

Never edit the `.git` folder manually.

---

# Git Commit

A commit is a snapshot of the project at a specific point in time.

Workflow:

Working Directory
↓

git add
↓

Staging Area
↓

git commit
↓

Repository History

Good commits represent meaningful milestones.

Examples:

✅ Initial project structure and repository setup

✅ Configure Express server

✅ Implement JWT authentication

Avoid meaningless commit messages such as:

❌ Update

❌ Fix

❌ Changes

---

# git add

`git add` does NOT save the project.

It tells Git:

"I want these changes to be included in my next commit."

Think of it as placing files into a folder before officially submitting them.

---

# .gitignore

`.gitignore` tells Git which files should never be tracked.

Common examples:

- node_modules/
- .env
- build folders
- temporary files
- operating system files

Sensitive information such as passwords and API keys should never be committed.

---

# Node.js

Node.js allows JavaScript to run outside the browser.

It is required for:

- React
- Express
- npm

---

# npm

npm stands for Node Package Manager.

It downloads and manages JavaScript libraries.

Example:

```bash
npm install express
```

Instead of writing Express ourselves, npm downloads it from the npm registry.

---

# package.json

package.json is the project's dependency list.

It tells npm:

"What packages does this project need?"

It also stores:

- project name
- scripts
- dependencies
- development dependencies

Think of it as a shopping list.

---

# package-lock.json

package-lock.json stores the EXACT versions of every installed dependency.

This ensures every developer installs identical versions.

Think of it as the receipt for the shopping list.

Always commit package-lock.json.

---

# node_modules

node_modules contains downloaded libraries.

It is NOT my code.

It can always be recreated using:

```bash
npm install
```

Never upload node_modules to GitHub.

---

# NVM

NVM stands for Node Version Manager.

It allows multiple Node.js versions to exist on the same computer.

Instead of uninstalling one version to install another, developers can simply switch versions.

Example:

```bash
nvm use 20
```

This is common in professional development because different projects often require different Node versions.

---

# Why We Switched to Node 20

Originally I was using:

Node 22

While creating the React project, Vite failed with errors related to Rolldown native bindings.

The issue was caused by compatibility between:

- Node 22
- latest create-vite
- Intel macOS

Instead of spending hours debugging tooling, we switched to Node 20 LTS using NVM.

Result:

The project scaffolded successfully.

Lesson:

Stable tooling is usually better than the newest tooling.

---

# Scaffolding

Scaffolding means generating the initial project structure before writing application code.

For React, Vite automatically creates:

- folder structure
- configuration files
- package.json
- source files

Scaffolding saves time and follows industry standards.

---

# Vite

Vite is the modern build tool for React applications.

Advantages:

- very fast startup
- fast hot reload
- modern tooling
- recommended over Create React App

---

# React

React is a JavaScript library for building user interfaces.

React allows applications to be built using reusable components instead of large HTML pages.

---

# Why We Use React

For this project React helps demonstrate:

- component-based development
- reusable UI
- frontend architecture
- modern web development practices

---

# Frontend vs Backend

Frontend

- Runs in the browser
- What the user sees
- React

Backend

- Runs on the server
- Business logic
- REST API
- Authentication
- Database communication

---

# PostgreSQL

PostgreSQL is a relational database.

It stores application data such as:

- users
- flights
- gates
- incidents

The frontend never communicates directly with PostgreSQL.

Instead:

React
↓

Express API
↓

PostgreSQL

---

# Software Engineering Mindset

Always ask:

"Is this part of my project or part of my computer?"

Examples:

NVM

❌ Project
✅ Local machine

PostgreSQL installation

❌ Project
✅ Local machine

React components

✅ Project

Express API

✅ Project

---

# README

The README is usually the first thing recruiters read.

A good README should include:

- project overview
- technologies
- architecture
- setup instructions
- screenshots
- API overview

---

# Debugging Mindset

Don't immediately search for random fixes.

Instead:

1. Read the error carefully.
2. Isolate the problem.
3. Test one thing at a time.
4. Understand the root cause.
5. Apply the simplest solution.

---

# Engineering Lessons

A project that is clean, organized, and complete is more valuable than one that is large but unfinished.

Prioritize:

- clean architecture
- readable code
- consistent commits
- good documentation
- stable tooling
- understanding over copying
