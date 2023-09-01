---
sidebar_position: 3
sidebar_label: Installation
title: Installation
---

## Creating new projects

You can create new Gaudi project from scratch using `create-gaudi-app` tool.

To run `create-gaudi-app` you may choose one of the following methods:

#### npx

```bash
npx create-gaudi-app
```

#### npm

```bash
npm create gaudi-app
```

#### yarn

```sh
yarn create gaudi-app
```

Interactive wizard will guide you through the process.

## Supported templates

Gaudi supports the following templates:

- **Gaudi backend project** - Gaudi backend, with TypeScript runtime
- **Gaudi backend with React+TS+Vite frontend** - A full-stack setup with Gaudi backend, TypeScript runtime, and Vite/React/Typescript on the frontend

## Adding Gaudi to an existing project

You can run Gaudi alongside existing [express](https://expressjs.com/) project. To do this, install `gaudi` package:

```bash
npm install gaudi
```

and integrate Gaudi using `useGaudi` express middleware provided by `gaudi` package

```js
import { useGaudi } from "@gaudi/runtime/dist/server/express";

const app = express();

app.use(useGaudi(config));

app.listen(3001, "localhost", () => {
  console.log(`Gaudi app is started ...`);
});
```
