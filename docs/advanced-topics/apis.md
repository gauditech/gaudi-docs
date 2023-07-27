# APIs

## Match target record by other property

Single cardinality endpoints (eg. `get` and `update` endpoints) must have a target record on which they will work on. They take the parameter from URL and try to match a target record by one of it's properties.
By default, they will match them by `id` property but if you need to match them by some other property (eg. `slug`) you can use entrypoints `identify` atom.

```js
model Repo {
  field name { type string }
  field slug { type string, unique }
}
entrypoint Repo {
  identify { through slug }

  get endpoint {}
}

// HTTP call
// GET /api/repo/<slug>
```
