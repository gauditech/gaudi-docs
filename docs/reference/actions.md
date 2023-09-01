---
sidebar_position: 3
---

# Actions

## Action block

Actions are located in endpoints inside an `action` block and can contain one or more actions.

### Syntax

```js
action {
  // ... actions
}
```

## Create action

Create action creates a new record in target model. Action doesn't have a target record but operates on a collection of data. It supports `input` and `set` atoms.

By default, action will turn every target model's `field` into `input`, unless a a field is set using `set` atom in which case provided setter will be used instead.

Action in the same endpoint are all run in a single database transaction.

### Syntax

```javascript
create <target> [as <alias>] {
  // optional "input" and/or "set" atoms
}
```

#### Examples

```javascript
// creates a new record in "Org"; created record is available under "newOrg" alias
create Org as newOrg {}
```

## Update action

Update action updates fields on the target record. Action always operates on a single record. It supports `input` and `set` atoms.

By default, action will turn every target model's `field` into `input`, unless a a field is set using `set` atom in which case provided setter will be used instead.

### Syntax

```javascript
update <target> [as <alias>] {
  // "input" and "set" atoms
}
```

#### Examples

```javascript
// update target "Org" record; updated record will be available under "updatedOrg" alias
update Org as updatedOrg {
  // optional "input" and "set" atoms
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
validate with key <alias> {
  // validation expression
}
```

#### Examples

```javascript
create Org as org {}

// report error under "description" key
validate with key "description" {
  // ensures that description is different than name
  isNotEqual(org.name, org.description)
}
```

## Query action

Query actions can be used to run arbitrary queries on model and model relationships. These queries can be used to fetch data to be used in subsequent actions or to make changes on existing data.

Action supports `select`, `update` and `delete` atoms.

### Syntax

```js
query <as <alias>> {
  from <target>,
  filter { <expression> },
  // update data
  update { <setter list> }
  // or delete data
  delete
  // or select data
  select { <fields list> }
}
```

#### Examples

```js
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

:::

## Respond action

Respond action can be used to send custom response to client request. It can be used to send static response or use data in the action context provided by other actions (e.g. `fetch`).

### Syntax

```js
respond {
  body <expression>
  [httpStatus <code>]
  [headers {
    "header name" <expressions>,
    // ... other headers
  }]
}
```

#### Examples

```js
query as updated {
  from Org,
  update { set foo "foo" },
  select { id, name, foo }
}

respond {
  body updated
  httpStatus 202
  headers {
    "My custom header" stringify(count(updated))
  }
}
```

## Execute action

TODO: describe execute action

# Action atoms

## Input

Input is used to include target model property in an input schema and/or to override some of it's properties (e.g. validation).

### Properties

#### `optional`

Makes input field optional and ommits it from action if not provided in input.

### Syntax

```js
// optional
update {
  input {
    <field_name> [{ options }]
  }
}
```

#### Usage in actions

`create` and `update` actions operate on a single record, as per **cardinality rules**.

#### Examples

```javascript
create Org as newOrg {}

update newOrg as newNewOrg {
  // accept only "name" in input
  input { name }
}

create org.memberships {
  set user @auth
  set role "admin"
}
```

## Set

Set is used to manually set field value and omit them from input schema. This value can be any valid expression or a `hook` that resolve to primitive value.

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
