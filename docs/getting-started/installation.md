---
sidebar_position: 3
sidebar_label: Installation
title: Installation
---

## Creating new projects

You create new Gaudi project from scratch using `create-gaudi-app` tool.

Run the following command:

```bash
npx create-gaudi-app
```

Interactive wizard will guide you through the process.

## Supported templates

Gaudi supports the following templates:

- `gaudi-ts`: Gaudi backend, with TypeScript runtime
- `vite-react-ts`: A full-stack setup with Gaudi backend, TypeScript runtime, and Vite/React/Typescript on the frontend

## Adding Gaudi to an existing project

You can run Gaudi alongside existing `express.js` project. To do this, install `gaudi` package:

```bash
npm install gaudi
```

and integrate `useGaudi` express middleware, see [example](./installation.md) (TODO).