---
sidebar_position: 5
---

# Application

## Building

In order to run your new application, you must first build it using Gaudi compiler.

The Gaudi compiler not only checks the syntax of source files but also performs a complete static analysis of your application. It verifies model names, fields, identifier types, expressions, queries, and much more. This step helps identify many potential problems and bugs as early as possible.

If all checks pass without any issues, the Gaudi compiler will produce a _"definition"_ file, which essentially provides an abstract description of your application. This "definition" file serves as input for the Gaudi runtime, which ultimately runs your application.

To execute the Gaudi compiler, use Gaudi CLI in your project directory.

```sh
npx gaudi-compiler
```

## Running

Gaudi runtime is a Node.js based backend runtime that takes a _"definition"_ file produced by the Gaudi compiler and starts your application.

Gaudi can be run as a standalone server or be integrated into an existing Node.js application. Currently, Gaudi supports [express](https://expressjs.com/) web server.

### Standalone server

Gaudi comes with an embedded `express` server and if you're developing a pure Gaudi application, you can simply start your application via the CLI.

```sh
gaudi start
```

### Embedded Gaudi

If you're already developing your Node.js aplication and want to embed Gaudi and develop other parts of your application within it you can use `useGaudi` express middleware provided by the `gaudi` package

```js
import { useGaudi } from "@gaudi/runtime/dist/server/express";

const app = express();

// embed Gaudi in root path "/"
app.use(useGaudi(config));

// embed Gaudi in subpath "/gaudi"
// app.use("/gaudi", useGaudi(config));

app.listen(3001, "localhost", () => {
  console.log(`Gaudi app is started ...`);
});
```
