---
sidebar_position: 5
---

# Application

## Building

In order to run your new application, you must first build it using Gaudi compiler.

The Gaudi compiler not only checks the syntax of source files but also performs a complete static analysis of your application. It verifies model names, fields, identifier types, expressions, queries, and much more. This step helps identify many potential problems and bugs as early as possible.

If all checks pass without issues, the Gaudi compiler will produce a _"definition"_ file, which essentially provides an abstract description of your application. This "definition" file serves as an input for the Gaudi runtime, which brings your application to life.

To execute the Gaudi compiler, use Gaudi CLI in your project directory.

```sh
npx gaudi build
```

## Running

Gaudi runtime is a Node.js based backend runtime that takes a _"definition"_ file produced by the Gaudi compiler and runs your application.

Gaudi can be run as a standalone server or be integrated into an existing Node.js application. Currently, Gaudi supports [express](https://expressjs.com/) web server.

### Standalone server

Gaudi comes with an embedded `express` server and if you're developing a pure Gaudi application, you can simply start your application via the CLI.

```sh
npx gaudi start
```

#### Environment variables

The following variables can be used to customize an embedded server:


| Name                            | Default                                          | Description                                                                                                                      |
|---------------------------------|--------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `GAUDI_DIRECTORY_NAME`          | `"gaudi"`                                        | name of directory where Gaudi stores generated files that **should** be stored in version control (eg. database migration files) |
| `GAUDI_DATABASE_URL`            |                         -                        | database connection string                                                                                                       |
| `GAUDI_RUNTIME_SERVER_HOST`     | `"127.0.0.1"`                                    | HTTP server host                                                                                                                 |
| `GAUDI_RUNTIME_SERVER_PORT`     | `3001`                                           | HTTP server port                                                                                                                 |
| `GAUDI_RUNTIME_OUTPUT_PATH`     | `"dist"`                                         | output path for generated files which **should not** be stored in a version control                                              |
| `GAUDI_RUNTIME_DEFINITION_PATH` | `GAUDI_RUNTIME_OUTPUT_PATH` + `"/definition.json"` | path to a definition file                                                                                                        |
| `GAUDI_CORS_ORIGIN`             | `""` (disables CORS support)                     | a list of domains which support CORS support - use `"*"` to support any domain                                                   |

### Embedded Gaudi

If you're already developing your Node.js application and want to embed Gaudi and develop other parts of your application within it you can use `useGaudi` express middleware provided by the `gaudi` package

```js
import { useGaudi } from "@gaudi/runtime";

const app = express();

const config = {
  outputDirectory: "dist",
  definitionPath: "dist/definition.json",
  dbConnUrl: process.ENV.GAUDI_DATABASE_URL,
  cors: { origin: true }
}

// embed Gaudi in root path "/"
app.use(useGaudi(config));

// embed Gaudi in subpath "/gaudi"
// app.use("/gaudi", useGaudi(config));

app.listen(3001, "localhost", () => {
  console.log(`Gaudi app is started ...`);
});
```

### Database access

Application needs a database connection in order to run. Database access is configured as an environment variable `GAUDI_DATABASE_URL` located in `.env` so make sure this matches your database configuration.
