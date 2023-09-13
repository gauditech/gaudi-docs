---
sidebar_position: 3
---

# Actions

## Action block

Actions are located in endpoints inside an `action` block and can contain one or more actions. Actions in an endpoint are all wrapped in a database transaction.

### Syntax

```js
action {
  // ... actions
}
```

## Create / update action

Create action creates a new record in a **collection**. Update action updates values of a **single** record.

Create and update action support `input`, `reference` or `set` properties.


### Syntax

```javascript
create <target> [as <alias>] {
  // optional "input", "reference", "set" properties
}
update <target> [as <alias>] {
  // optional "input", "reference", "set" properties
}
```

#### Examples

```javascript
// creates a new record in "Org"; created record is available under "newOrg" alias
create Org as newOrg {}
// updates an existing record
update newOrg as newerOrg {
  input { name }
}
```



### Action properties

#### Input

##### Input properties

- `default`: provides a default expression which will be stored if client hasn't provided a value (thus, marking an `input` as *optional*)
- `requried`: marking an `input` as *required*, validating that the value is provided by client (useful in update action in which all inputs are optional by default)

##### Examples & syntax

```js
update myOrg as newOrg {
  input { name, description }
}

create Org as newOrg {
  // "name" is implicitly an input
  input { description { default "Description of " + name } }
}

update org as newOrg {
  input { name { required }, description } // name is required, description is optional
}
```

#### Set

Set defines a server-side expression which will be executed when action triggers.

##### Examples

```js
set name "My name"
set currentTs now()
set description "Created at " + stringify(currentTs)
```

#### Reference

Reference can be used to replace `input` on a field created by a model `reference`. It defines a path that can uniquely identify a referencing record by a value provided by clients.

##### Examples

```js
model User {
  reference profile { to Profile }
}
model Profile {
  field email { type string }
}
model Org {
  reference owner { to User }
}
// example actions
create User as user {
  reference profile { through email }
}
create Org as org {
  reference owner { through profile.email }
}

```

## Delete action

Delete operates on any kind of relationship, both single records and collections. It doesn't support any properties, and can't have an `alias`.

#### Syntax

```javascript
delete org.repos {}
```

## Validate action

A `validate` action can be used to run custom validation expressions. It expects a `key` which specifies under which field name the error will be added in validation error response.

### Syntax

```javascript
validate with key <key> {
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

Query actions can be used to run arbitrary queries in order to fetch the data (to be used in subsequent actions via `alias`) or to make changes on existing data.

Action supports `select`, `update` and `delete` properties.

### Syntax

```js
query <as <alias>> {
  from <target>,
  filter { <expression> },
  // update data
  update { <list of properties> }
  // or delete data
  delete
  // or select data
  select { <list of names> }
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

#### Usage of `select` property

If `select` atom is omitted from `query`, Gaudi will automatically return only properties actually used in subsequent actions but still consider it to be of target model type (e.g. `Post`). Providing explicit `select` will turn this `alias` into a `struct` type.

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

Execute actions allow you to run custom javascript code via `hook`, and stores the result in the context.

### Syntax

```js
execute as <alias> {
  hook {
    // hook atoms
  }
}
```

#### Examples

```js
execute as rating {
  hook {
    arg user_id @auth.id
    source fetchUserRating from "hooks/redis.js"
  }
}
```

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
