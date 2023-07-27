---
sidebar_position: 2
title: How it works
---

## Configuration

Valid Gaudi project needs to have a configuration file at the project's root directory. Configuration file can be one of the following:

- `gaudiconf.json`
- `gaudiconf.yaml`

Configuration file supports following properties:

- `rootDir` - Used to determine the root directory from which Gaudi compiler should load your Gaudi code. This is typically set to `.` or `src`. Compiler will recursively check for all Gaudi files in this directory whose filenames end with `.gaudi` extension. This corresponds to `**/*.gaudi` glob expression. Defaults to current working directory.
- `outDir` - Directory where Gaudi should output resulting files. Defaults to current working directory.

## Gaudi source code

You can split Gaudi source code in multiple files or directories, as you see fit. Files are automatically imported, and the order doesn't matter.

### VSCode

For full development experience you can download the [VSCode extension](./). It includes syntax highlighting, error reporting, and more.

## The compiler

The compiler compiles your Gaudi source code and checks for possible errors. Depending on the code, the compiler will produce various outputs. Some of them include:

- a definition file, which is used to build your application runtime
- an OpenAPI schema file, used to serve Swagger UI documentation
- a JavaScript/TypeScript client integration library

## Custom code

You can integrate custom JavaScript code using hooks.

You can read more about this topic: [Runtimes and hooks](../runtimes-hooks)

## Runtime

Run your application as a standalone server or embed it in your custom [express](https://expressjs.com/) server as a standard middleware.
