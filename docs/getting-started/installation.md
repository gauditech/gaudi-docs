---
sidebar_position: 3
sidebar_label: Installation
title: Installation
---

## Creating new projects

Typically, you create new Gaudi projects using `create-gaudi-app`.


### Interactive mode

Just type the following to create new application:

```bash
npx create-gaudi-app
```

### Non-interactive mode

If you don't want to use the interactive mode, you can pass the arguments directly:

```bash
npx create-gaudi-app --title "Book reviews app" --template "vite-react-ts"l
```

To get a full list of supported arguments, run `--help`:

```bash
npx create-gaudi-app --help
```

## Supported templates

Gaudi supports the following templates:

- `backend`: Gaudi backend only
- `vite-react-ts`: A full-stack setup with Gaudi backend and Vite/React/Typescript on the frontend

## Adding Gaudi to an existing project

FIXME Documentation missing.