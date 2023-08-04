---
sidebar_position: 1
slug: /advanced-topics
---

# APIs

## Match target record by other property

Single cardinality endpoints (e.g. `get` and `update` endpoints) must have a target record on which they will work on. They take the parameter from URL and try to match a target record by one of it's properties.
By default, they will match them by `id` property but if you need to match them by some other property (e.g. `slug`) you can use entrypoints `identify` atom.

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

## Returning relationships

When returning some model records, by default, only direct fields of the target model will be included. If a model has relations or references to other models, these fields can also be included as nested object in endpoint response.

```
// includes ALL fields of "author" relation
response { id, title, author }

// includes only "name" of "author" relation
response { id, title, author { name } }
```
