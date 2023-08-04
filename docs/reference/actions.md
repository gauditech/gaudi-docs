---
sidebar_position: 3
---

# Actions

## Actions block

Actions are located in endpoints inside an action block

### Syntax

```js
action {
  // ... actions
}
```

## Create action

Create action operates on a collection of data. It supports `input` and `set` atoms.

By default, `create` will turn every model `field` into `input`, unless a `default` value is provided in the field specification - in that case, `set` will be used instead.

### Syntax

```javascript
create Org as myOrg { ... }
```

## Update action

Update action operates on a single record. It supports `input` and `set` atoms. For security reasons, `input` atoms must be explicit. You can use `input *` to mark all fields as updateable.

### Syntax

```javascript
update myOrg as updatedOrg {
  input { name, description }
}
```

## Delete action

Delete operates on a single record, but it also works any kind of relationship, both single records and collections. It doesn't support any atoms, and can't have an `alias`.

#### Syntax

```javascript
delete org.repos {}
```

## Validate action

A `validate` action can be used to run custom validation expressions. It expects a `key` which specifies under which field name the error will be added in validation error response.

### Syntax

```javascript
create Org as org {}

// ensure description is different than name
validate with key "description" { isNotEqual(org.name, org.description) }
```

:::info
You can read more on data validation on a **dedicated data validation page**.
:::

## Query action

Query action is used to fetch data using relationships and use that data in subsequent actions. `query` supports `select`, `update` and `delete` atoms.

### Syntax

```javascript
// make all user posts private
query as updatedPosts {
  from User.posts,
  filter { isDeleted is false },
  update {
    set isPublic false
  }
}
```

#### Usage of `select` atom

:::info

If `select` atom is omitted from `query`, Gaudi will automatically return only properties actually used in subsequent actions but still consider it to be of target model type (e.g. `Post`). Providing explicit `select` will turn this `alias` into a `struct` type.

TODO: link to automatic deps collection and context typing

:::

## Respond action

Respond action can be used in custom endpoints for sending HTTP response. It uses data available in the context so you can use other action types (e.g. `fetch`) to provide this data.

### Syntax

```javascript

query as updated {
  from Org,
  update { set foo "foo" },
  select { id, name, foo }
}
respond {
  body updated
  headers {
    "My custom header" stringify(count(updated))
  }
}
```

## Execute action

TODO: describe execute action

# Action atoms

## Input

Input is used to override some properties of an existing data model field.

### Properties

#### `default`

Makes an input field optional but uses provided as a default if not provided in input.

#### `optional`

Makes input field optional and ommits it from action if not provided in input.

### Syntax

```js
// default value
update {
  input isPublic { default false }
}

// optional
update {
  input description { optional }
}
```

#### Usage in actions

`create` and `update` actions operate on a single record, as per **cardinality rules**.

These are the only actions that can accept user inputs. See **fieldsets** for more info.

Here are some examples:

```javascript
create Org as newOrg {}

update newOrg as newNewOrg {
  input { name }
}

create org.memberships {
  set user @auth
  set role "admin"
}
```

## Set

Set is used to manually set field value. this value can be any expression or a `hook`

### Syntax

```js
// primitive value
update {
  set isPublic false
}

// from context
update {
  set author userFromContext
}

// hook
set nameAndDesc hook {
  arg name name
  arg desc description
  inline '`${name} and ${desc}`'
}

```
