---
sidebar_position: 1
slug: /advanced-topics/apis
---

# APIs

## Match target record by another field

Single cardinality endpoints (e.g. `get` and `update` endpoints) must have a target record on which they will work on. They take the parameter from URL and try to match a target record by one of it's fields.
By default, they will match them by `id` field but if you need to match them by another field (e.g. `slug`) you can use entrypoints `identify` atom.


```js
model Repo {
  field name { type string }
  field slug { type string, unique }
}

entrypoint Repo {
  // identify Repo record via "slug" field
  identify { through slug }

  get endpoint {}
}

// HTTP call
// GET /api/repo/<slug>
```

:::tip
In `identify`, `through` can also define a nested path, e.g. `"profile.username"`. The path has to be able identify an unique record, so it can only traverse fields and relationships which are marked as `unique`.
:::

## Customizing which data to return

When returning records, by default, only direct fields of the target model will be included. If a model has relations or references to other models, these fields can also be included as nested object in endpoint response.

```
// includes ALL fields of "author" relation
response { id, title, author }

// includes only "name" of "author" relation
response { id, title, author { name } }
```

:::tip
`response` supports much more than that! Check out [advanced data selection](./actions.md#advanced-data-selection) guide!
:::

## Nested entrypoints

Entrypoints can be nested.

```js
api {
  entrypoint Post as p {
    entrypoint comments as com {
      // PATCH /post/:post_id/comments/:comment_id
      update endpoint {}
      // POST /post/:post_id/comments/
      create endpoint {}
    }
  }
}
```

## Pagination

`list` endpoint supports a `paginable` property. It modifies the endpoint to expect `page` and `pageSize` URL parameters. This property modifies the response schema.

### Response schema

#### Without `paginable`

Consider the following snippet:

```js
entrypoint Post {
  response { id, name }
  list endpoint {}
}
```

The response would look like this:

```json
[{ "id": 1, "name": "First post" }, { "id": 2, "name": "Second post" }]
```

#### With `paginable`

With `paginable`, the Gaudi code would look like the following:

```js
entrypoint Post {
  response { id, name }
  list endpoint {
    paginable
  }
}
```

And the response schema would be as follows:

```json
{
  "page": 1,
  "pageSize": 10,
  "totalPages": 1,
  "totalCount": 2,
  "data": [
    { "id": 1, "name": "First post" },
    { "id": 2, "name": "Second post" }
  ]
}
```