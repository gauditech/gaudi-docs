---
sidebar_position: 7
---

# Generators

## Client library generators (JavaScript/TypeScript)

Generates a client library that can be used to integrate another JavaScript application with a Gaudi backend.

### Syntax

```js
generate client {
  target ts | js
  path <output path>
}
```

### Example

```js
generate client {
  target ts
  path "../client/api"
}
```

### Properties

#### `target`

Use `ts` for TypeScript, or `js` for a JavaScript client library.

#### `path`

A path on filesystem where a library should be stored.

## Swagger UI

Creates Swagger UI endpoint with a complete OpenAPI specification of your Gaudi API.

### Syntax

```js
generate apidocs {
  basepath <url path prefix>
}
```

### Example

```js
generate apidocs {
  basepath "/gaudi-api"
}
```

### Properties

#### `basepath`

**Optional** property. If set, instructs a generator to automatically prefix all endpoint URLs with a given prefix. This is useful when Gaudi is mounted on a non-root path using `useGaudi` middleware.