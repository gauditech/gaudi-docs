---
sidebar_position: 3
---

# Quick start

## Requirements

Gaudi is published as a NPM package.
To run it, you need the following software installed on your system:

- Node.js v18+
- PostgreSQL

## Installation

### New project

You can create new Gaudi project from scratch using `create-gaudi-app` tool.

To run `create-gaudi-app` you may choose one of the following methods:

#### npx

```bash
npx create-gaudi-app@latest
```

#### npm

```bash
npm create gaudi-app@latest
```

#### yarn

```sh
yarn create gaudi-app --latest
```

Interactive wizard will guide you through the process.

#### Supported templates

Gaudi supports the following templates:

- **Gaudi backend project** - Gaudi backend, with TypeScript runtime
- **Gaudi backend with React+TS+Vite frontend** - A full-stack setup with Gaudi backend, TypeScript runtime, and Vite/React/Typescript on the frontend

### Existing project

You can run Gaudi alongside existing [express](https://expressjs.com/) project. To do this, install `gaudi` package:

```bash
npm install gaudi
```

and run Gaudi application standalone or integrate it into an existing application. See [running Gaudi application](../core-concepts/application#running) for more details.

## VSCode Extension

For the best developer experience use Gaudi VSCode Extension to add syntax highlighting, error reporting and other.

Gaudi VSCode extension is distributed via VSCode Marketplace so you can [download](https://marketplace.visualstudio.com/items?itemName=gaudi.vscode) it from there or [install](https://code.visualstudio.com/docs/editor/extension-marketplace) it directly from your VSCode.
