---
sidebar_position: 2
sidebar_label: Customizing with Actions
title: Customizing with Actions
---

# Customizing with Actions

## About actions

Actions are the real "units of work" in Gaudi. Both `entrypoint`s and `endpoint`s are basically just a context in which `action`s are executed. Actions are defined in `endpoint` block. They are declarative, but their ordering matters, which also makes them somewhat imperative.

Gaudi supports several [types of action](#types-of-actions) which define the behavior of an endpoint. Each `endpoint` contains one or more action. Built-in endpoints (iow. all except `custom` endpoints), if not specified otherwise, contain one implicite action that matches their type. Eg. `create` endpoint contains `create` action. Custom endpoints contain no implicite actions so they require at least one explicite action.

Endpoint actions syntax

```js
// ...
create endpoint {
  action {
    create <target model> <as [alias]> {
      // action body
    }
  }
}
// ...
```

Each action requires a model it will work upon. By default, target model is optional and defaults to current action's `entrypoint` target model. If you need to affect (eg. create or update) other models in the same request, then `<target model>` can be used to indicate which model the action is targeting.

Example

```js
entrypoint Users {
  create endpoint {
    action {
      // create new User record and store it in context with alias "createUser"
      create as createdUser {
        // action body
      }
      // create new AuditLog record with a reference to "createdUser" record
      create AuditLog {
        set author createdUser
      }
    }
  }
}
// ...
```

### Context

All actions work with some data. They needs some data on input and return some data on output. This input and output come from their _"context"_. Context is an environment created by action's parent `entrypoint` and `endpoint`. It is something like a namespace or a map in which values can be stored and taken from. Eg. URL parameters, input body, outputs from previous actions, ...

### Context and aliases

Each action can define an alias using `as` keyword. This stores the result of the action in the context, and makes it available to subsequent actions. Aliases stored in the context are immutable.

Here's an example that describes this behavior:

```js
// action that updates record referenced by the "user" property
update user as updatedUser {
  input { username }
}

// action that creates a new "UsernameLog" record
create UsernameLog {
  set userId user.id
  set old user.username // this hasn't changed
  set new updatedUser.username // this is the updated value
}
```

### Fieldsets

Fieldset is a collection of user inputs for a specific endpoint. This describes a JSON data structure an endpoint expects in a HTTP body.

Fieldsets are generated automatically based on endpoint actions and extra inputs. This means that Gaudi will go through all your actions, collect all fields that they use and automatically generate schema of input required by your endpoint.

If your actions use target model's fields, Gaudi knows evenrything about them and can automatically generate proper validations. If you need custom fields that do not corelate directly to the fields in target model, you can override some properties of your fields (eg. add default value) or even use `extra input`s to describe completely arbitrary fields.

// TODO: describe inputs, extra inputs and sets

#### Fieldset creation rules

Here's how the fieldset is calculated:

- include every field defined inside `extra inputs` in the root namespace
- for every `create` and `update` action:
  - namespace equals to `alias`
  - `id` is never included in the fieldset
  - if there's a `set` atom, field is not included in the fieldset
  - if action target is a relationship to an existing record, the parent `reference` is not included in the fieldset
  - if the reference relationship is created via `reference through`, the target field replaces the reference field
  - if there's a `default` in a field specification, the field is **optional**
  - in `update`, inputs must be explicitly declared using `input` atom
  - in `create`, every field not covered by previous rules is included as a required input

Fieldset creation example

```javascript

// let's define our models first
model Org {
  field name { type string }
  field paymentPlan { type string }
  relation memberships { from OrgMembership, through org }
}

model User {
  field email { type string }
  field acceptsTos { type boolean, default false }
  relation orgMemberships { from OrgMembership, through user }
}

model OrgMembership {
  reference org { to Org }
  reference user { to User }
}

api {
  entrypoint Org {
    create endpoint {
      action {
        create as org {
          set paymentPlan "freemium"
        }
        create User as user {}
        // creating org.memberships automatically
        // sets membership.org to `org`
        create org.memberships as membership {
          set user user
        }
      }
    }
  }
}
```

Example of a valid JSON body

```json
{
  "org": { "name": "Acme Inc" },
  "user": { "email": "john.doe@gaudi.tech" }
}
```

Fieldset field creation table

| Alias      | Table name    | Field          | In fieldset                        |
| ---------- | ------------- | -------------- | ---------------------------------- |
| org        | Org           | id             | **no** - id field is autogenerated |
|            |               | **name**       | **required**                       |
|            |               | paymentPlan    | **no** - set on the server side    |
| user       | User          | id             | **no** - id field is autogenerated |
|            |               | **email**      | **required**                       |
|            |               | **acceptsTos** | **optional** - has a default value |
| membership | OrgMembership | id             | **no** - id field is autogenerated |
|            |               | org_id         | **no** - set on the server side    |
|            |               | user_id        | **no** - set on the server side    |

## Types of actions

### `create`

Create action operates on a collection of data. It supports `input` and `set` atoms.

By default, `create` will turn every model `field` into `input`, unless a `default` value is provided in the field specification - in that case, `set` will be used instead.

#### Syntax

```javascript
create Org as myOrg { ... }
```

### `update`

Update action operates on a single record. It supports `input` and `set` atoms. For security reasons, `input` atoms must be explicit. You can use `input *` to mark all fields as updateable.

#### Syntax

```javascript
update myOrg as updatedOrg {
  input { name, description }
}
```

### `delete`

Delete operates on a single record, but it also works any kind of relationship, both single records and collections. It doesn't support any atoms, and can't have an `alias`.

#### Syntax

```javascript
delete org.repos {}
```

### `validate`

A `validate` action can be used to run custom validation expressions. It expects a `key` which specifies under which field name the error will be added in validation error response.

#### Syntax

```javascript
create Org as org {}

// ensure description is different than name
validate with key "description" { isNotEqual(org.name, org.description) }
```

:::info
You can read more on data validation on a **dedicated data validation page**.
:::

### `query`

Query action is used to fetch data using relationships and use that data in subsequent actions. `query` supports `select`, `update` and `delete` atoms.

#### Syntax

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

If `select` atom is omitted from `query`, Gaudi will automatically return only properties actually used in subsequent actions but still consider it to be of target model type (eg. `Post`). Providing explicit `select` will turn this `alias` into a `struct` type.

TODO: link to automatic deps collection and context typing

:::

### `respond`

Respond action can be used in custom endpoints for sending HTTP response. It uses data available in the context so you can use other action types (eg. `fetch`) to provide this data.

#### Syntax

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

### `execute`

TODO: describe execute action

## Action atoms

### `input`

Input is used to override some properties of an existing data model field.

Properties

- `default [value]` - Makes an input field optional but uses provided as a default if not provided in input.
- `optional` - Makes input field optional and ommits it from action if not provided in input.

Syntax

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

### `set`

Set is used to manually set field value. this value can be any expression or a `hook`

Syntax

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
