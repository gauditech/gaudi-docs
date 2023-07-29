---
sidebar_position: 2
---

# APIs

## API

API block groups multiple top level entrypoints.

### Syntax

```js
api {
  // ... entrypoints
}
```

---

## Entrypoint

Entrypoint is a group of endpoints which operate on the same data model. Several `entrypoint`s can be grouped into an `api` block.

### Properties

##### `resource`

Data resource entrypoint operates on. Top-level entrypoints must use data model as their resource. Property is **required**.

##### `alias`

Alias is used as a `context` name for single cardinality endpoints, ioq. endpoints that have a target (eg. `get` and `update` endpoints). Property is optional.

### Syntax

```js
entrypoint <resource> [as <alias>] {
  // ... atoms
  // ... endpoints
}
```

## Identify

Use another model property for matching target record.

### Properties

##### `field`

Model field used for matching.

```js
entrypoint Repo {
  identify { through <field name> }
}
```

## Response

Defined record fields that will be returned by build-in actions.

### Syntax

```js
// syntax
entrypoint Repo {
  response { <prop1>, [prop2, ...] }
}

// example
entrypoint Repo {
  response { name, slug, description}
}

```

---

## Get endpoint

REST endpoint that returns one targeted record.

Uses with `GET` HTTP method.

##### Syntax

```js
get endpoint {}
```

URL syntax

```
GET /api/<resource name>/<identifier>
```

## List endpoint

REST endpoint that returns a list of matched records.

Uses `GET` HTTP method.

##### Syntax

```js
list endpoint {}
```

URL syntax

```
GET /api/<resource name>
```

## Update endpoint

REST endpoint that updates one targeted record.

Uses `PATCH` HTTP method.

### Properties

##### `alias`

Alias is used as a name in `context` for updated record. Propety is optional.

##### Syntax

```js
update endpoint [as <alias>] {}
```

URL syntax

```
PATCH /api/<resource name>/<identifier>
```

## Create endpoint

REST endpoint that creates a new record.

Uses `POST` HTTP method.

### Properties

##### `alias`

Alias is used as a name in `context` for newly created record. Propety is optional.

##### Syntax

```js
create endpoint [as <alias>] {}
```

URL syntax

```
POST /api/<resource name>
```

## Delete endpoint

REST endpoint that deletes one targeted record.

Uses `DELETE` HTTP method.

##### Syntax

```js
delete endpoint {}
```

## Custom endpoint

Customizable REST endpoint. It has no default action.

### Properties

##### `method`

Endpoint HTTP method.

##### `path`

URL fragment under which endpoint wil be registered.

Any URL-unsafe characters will be encoded, even `/`, so sibpaths are not supported.

##### `cardinality`

Does endpoint work on a collection or single record. Can be one of: `one`, `many`.

##### Syntax

```js
custom endpoint {
  method <method>
  path "<path>"
  cardinality <cardinality>

  // ... actions
}
```

URL syntax

```
DELETE /api/<resource name>/<identifier>
```
