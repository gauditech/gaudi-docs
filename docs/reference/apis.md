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

## Entrypoint

Entrypoint is a group of endpoints which operate on the same collection of records. Several `entrypoint`s can be grouped into an `api` block.

### Properties

##### `resource`

A collection of records an entrypoint operates on. Top-level entrypoints must use a model as their resource. Nested entrypoints can target `reference` or `relation` relationships. Property is **required**.

##### `alias`

Alias is used as a `context` name for single cardinality endpoints (e.g. `get` and `update` endpoints). Property is **optional**.

### Syntax

```js
entrypoint <resource> [as <alias>] {
  // ... properties
  // ... endpoints
}
```

## Identify

Specify which field to use to match a single record in the collection an entrypoint is operating on. In runtime, the value comes from the URL parameter.

### Properties

##### `path`

An identifier path. It can be a field or a relationship path which ends a field, and it must be `unique`.

```js
entrypoint Repo {
  identify { through <path> }
}

// examples
entrypoint Repo {
  identify { through slug }
}
entrypoint User {
  identify { through profile.email }
}
```

## Response

Defines record properties that will be returned by build-in actions.

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
list endpoint {
  <properties>
}
```

URL syntax

```
GET /api/<resource name>
```

### Properties

#### `filter`

Filter can be used to control which records are returned to a user.

##### Syntax

```js
filter { <expression> }
```

#### `paginable`

Returns only a subset of records, based on `page` and `pageSize` URL parameters. This property modifies the response schema, as described at [Advanced topics > APIs > Pagination](../advanced-topics/apis#pagination)

### Example

```js
entrypoint Post {
  list endpoint {
    filter {
      // list only public posts or user's own posts
      isPublic is true or author is @auth
    }
  }
}
```

## Update endpoint

REST endpoint that updates one targeted record.

Uses `PATCH` HTTP method.

### Properties

##### `alias`

Alias is used as a name in `context` for updated record. Property is optional.

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

Alias is used as a name in `context` for newly created record. Property is optional.

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

Any URL-unsafe characters will be encoded, even `/`, so sub paths are not supported.

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

## Extra inputs

Endpoint can specify extra inputs which are available in the context.

#### Syntax

```js
custom enpdoint {
  extra inputs {
    field <name1> { type <type1> } // accepts default & validate
    ...
    field <nameN> { type <typeN> }
  }
}
```
