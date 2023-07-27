---
sidebar_position: 5
title: Application
---

# Application

## Building

In order to run your new application, you must build it first. This is done using Gaudi compiler.

Gaudi compiler checks source files syntax, but not only that. It will run a complete static analysis of your application, check model names and fields, identifiers types, expressions and queries, ... and much more. This step helps to find many potential problems and bugs as early as possible.

If all checks go through and no problems are found, Gaudi compiler will output a _"definition"_ file which is basically an abstract description of your application. This _"definition"_ file is used as an input for Gaudi runtime which will run your application.

Gaudi compiler is run using Gaudi CLI in your project directory

```sh
npx gaudi-compiler
```

## Running

Gaudi runtime is a Node.js based backend runtime which takes a _"definition"_ file produced by Gaudi compiler and starts your application.

Gaudi can be run as a standalone server or be integrated into an existing Node.js application. Gaudi currently supports [express](https://expressjs.com/) web server.

### Standalone server

Gaudi comes with an embedded `express` server and if your're developing pure Gaudi application, you can simply start your application via CLI

```sh
gaudi start
```

### Embedded Gaudi

If your alredy developing your Node.js aplication and want to embed Gaudi and develop other parts of your aplicaiton in it you can use `useGaudi` express middleware provided by `gaudi` package

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
