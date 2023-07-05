---
sidebar_position: 2
sidebar_label: How it works
title: How it works
---

## Configuration

Valid Gaudi project needs to have a configuration file at the project's root directory. Configuration file can be one of the following:
- `gaudiconf.json`
- `gaudiconf.yaml`

Configuration file currently supports a single entry: `rootDir`. This is typically set to `.` or `src`. It is used to determine the root directory from which Gaudi compiler should load your Gaudi code.

You can write Gaudi code within the `rootDir`. Compiler will recursively check for all the files, whose filenames must end with `.gaudi` extension. This corresponds to `**/*.gaudi` glob expression.

## Gaudi source code

You can split Gaudi source code in multiple files or directories, as you see fit. Files are automatically imported, and the order doesn't matter.

### VSCode extension

You can download the [VSCode extension](./) for a better development experience - includes syntax highlighting, error reporting, and more.

## The compiler

The compiler compiles the source code and checks for possible errors. Depending on the code, the compiler will produce various outputs. Some of them include:

- a definition file, which is used to build your application runtime
- an OpenAPI schema file, used to serve Swagger UI documentation
- a JavaScript/TypeScript client integration library

## Runtimes

You can integrate custom JavaScript code using runtimes and hooks.

You can read more about this topic: [Runtimes and hooks](../runtimes-hooks)
