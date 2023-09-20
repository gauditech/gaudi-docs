# Actions

## Customizing the endpoint action

If you want to extend the default endpoint behavior (required for `custom` endpoints), you can specify the `action` block.

```javascript
entrypoint Organization {
  create endpoint {
    action {
      // default `create` action for this endpoint
      create as org {}
      // assign current user as admin member of the org
      create org.memberships as member {
        set member @auth
        set role "admin"
      }
    }
  }
}
```

## Behavior of create and update actions

Create and update actions are similar in structure, they support the same properties:
- `input`, which defines a value that should be provided by the client via HTTP body
- `reference-through`, similar to input, but referencing another record via a value that uniquely identifies it; it can only be used on model's `reference` properties
- `set`, a server-side provided value

### Targeting model's `reference` properties

Only two kinds of model properties are persisted to the database: `field` an a `reference`. Internally, a `reference` is represented as a `field` as well - appending the `"_id"` to it's name, as shown in the following example:

```js
model Post {
  reference author { to User }
  computed implicitAuthorId {
    // highlight-start
    // this exists!
    author_id
    // highlight-end
  }
}
```

Therefore, a `reference` property can be represented in the action properties in two ways - directly via `reference`, or via corresponding `field`. You can only provide one or another - not both.

Let's see some examples to further clarify this behavior:

```js
update parentPost as updated {
  // four different ways to specify an action property targeting a reference
  input { author_id }
  reference author { through id }
  set author_id parentPost.author_id
  set author parentPost.author
}
```

### Create action

Create action creates a new record in a collection - it can target `model` or `relation` resources.

If no behavior is defined for a specific field, an implicit one will be created. If a `field` spec (as defined in the `model`) has a `default` value, it will be turned into an implicit `set`. Otherwise, an `input` will be used. In create, inputs are `required`. This can be changed by defining an input manually and passing a default.

#### Examples

##### Implicit properties

```js
model Org {
  field name { type string }
  field location { type string, default "San Francisco" }
}
// define an "empty" create action
create Org as org {}

// which is the equivalent of the following
create Org as org {
  input { name }
  set location "San Francisco"
}
```

##### Optional inputs

Instead, you can turn *location* into an optional input with a default:

```js
create Org as org {
  input { location { default "San Francisco" } }
}
```

In this case, *name* is a required input, and *location* is optional, with a default.

### Update action

Update action operates on a single record - it can target a context *alias*, or a related record.

Update action supports the same properties as create, with some behavioral differences:

- there are no implicit behavior, every `input` or `set` must be specified
- inputs are optional, use `required` to validate that a new value is provided by clients

#### Examples

##### Targeting resources

The following are allowed:
```js
update org as newOrg {...}
update org.profile as newProfile {...} // `profile` is a reference or a relation into a `unique` reference
```

The following are not allowed because it targets a collection of records:
```js
update Org as orgs {...}
update org.repos as repos {...}
```

:::tip
`update` works with single records only - use [`query`](../reference/actions#query-action) action to update multiple records in the database.
:::

##### Marking inputs as required

```js
update org as newOrg {
  input { name { required } }
}
```

## Advanced data selection

When querying data, you can list which model properties you want your query to return. This does not constrain you only to direct model properties but works also on nested relationships.

This can be used when defining the following:
- in model hooks, `arg <name> query { ... }`
- in entrypoints and endpoints, a `response` property
- in `query` action, a `select` property


Let's start with a simple example:

```
query as result {
  from Org,
  // highlight-next-line
  select { name, description }
}
```


### Selecting nested relationships

If you want to add nested relationships, eg. from a `reference` or a `relation`, you can add a nested block:

```
select { name, description, repos { id,  name } }
```

If you omit a block, all `fields` will be selected:

```
// includes all the fields from `repos`, without hooks, computeds and nested relationships
select { name, description, repos }
```

### Selecting non-persistent model properties

You can include `hook` and `computed` in the selection as well:

```
// assuming `externalScore` is a `hook`, and `computedScore` is a `computed`
select { name, externalScore, computedScore }
```

### Custom expressions

You can even select ad-hoc properties using custom expressions!

```
select {
  id,
  name,
  repoCount: count(repos.id),
  nameAndDesc: name + " " + description
}
```