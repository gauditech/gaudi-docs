---
sidebar_position: 3
---

# Actions

## About actions

Actions are the real "units of work" in Gaudi. Both `entrypoint`s and `endpoint`s basically just create a context in which `action`s are executed. Actions are defined inside endpoints and each endpoint can have one or more actions. They are declarative, but their ordering matters, which also makes them somewhat imperative.

Gaudi supports several [types of actions](../reference/actions) which define the behavior of an endpoint. CRUD endpoints (all except `custom` endpoints), if not specified otherwise, contain an implicit action that matches their type. E.g. `create` endpoint contains `create` action etc. Custom endpoints contain no implicit actions so they require at least one explicit action.

#### Endpoint actions syntax

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

Each action requires a model it works on. By default, target model is optional and defaults to the current action's `entrypoint` target model. If you need to work with other models (e.g. create, update, fetch, ...) in the same request, then `<target model>` can be used to indicate which model the action is targeting.

Action can define an `alias` using `as` keyword. If the action returns a value (e.g. fetches, creates or updates a record), this value can later be accessed via that alias. More on aliases in [context](#context) section.

:::tip
Actions in an endpoint are all wrapped in a database transaction.
:::

#### Endpoint actions example

```js
// default target model in this entrypoint is "User"
entrypoint User {
  update endpoint {
    // contains only implicit default action which updates all the fields on default "User" model
  }

  create endpoint {
    // action block
    action {
      // default model action
      // create new "User" record and store it in context with alias "createUser"
      create as createdUser {
        // action body
      }
      // create new "AuditLog" record with a reference to "createdUser" record
      create AuditLog {
        set author createdUser
      }
    }
  }
}
// ...
```

## Context and aliases

Actions usually need some data to work with; they may receive it from the client or read it from the database. This data is called action's _"context"_. Actions can access data already stored in the context.

If an action returns a result and defines an `alias`, result is stored and can be accessed by the name defined by the alias. Aliases stored in the context are immutable and cannot be overwritten by the subsequent actions.

Here's an example that describes this behavior:

```js
// action that updates record referenced by the "user" property
update user as updatedUser {
  input { username }
}

// action that creates a new "UsernameChangelog" record
create UsernameChangelog {
  set userId user.id
  set oldValue user.username // this hasn't changed
  set newValue updatedUser.username // this is the updated value
}
```

Each `entrypoint` can also specify an alias using `as` attribute.

Nested entrypoints create nested context. Aliases created in parent contexts are visible in child contexts. Shadowing of aliases in parent contexts is not allowed and an error will be thrown.

An entrypoint alias is visible in contexts of single-cardinality endpoints, as well as in nested entrypoints.

```javascript
entrypoint Topic as topic {
  entrypoint posts as post {
    authorize {
      // this block can see `topic` alias
      // this block can't see `post` alias because it's scoped to a collection of posts
    }
    update endpoint {
      authorize {
        // this block can see both `topic` and `post` aliases
      }
      action {
        // entrypoint alias can be used in the action block, just like any other context alias
      }
    }
  }
}
```

## Accessing client data

### Action inputs

Gaudi generates a request schema from all `input` and `reference-through` defined in an action; keep in mind that `create` action may define inputs implicitly.

#### Examples

```js
model Org {
  field name { type string }
  field description { type string }
}

entrypoint Org {
  create endpoint {}
}

// => valid JSON input
// {
//   "name": "string",
//   "description": "string"
// }
```

If an endpoint contains more than a default action, then a request schema is constructed of all of their models. Fields of non-default actions are always namespaced in action's alias to avoid name collision between different models. that means that alias is required for all non-default actions.


```js
model Org {
  field name { type string }
  field description { type string }
}

model User {
  field name { type string }
  field email { type string }
}

entrypoint Org {
  create endpoint {
    extra inputs {
      field extra { type number }
    }
    action {
      // default action
      create {}
      // additional action
      // alias is required as it is used as a namespace in a fieldset
      create User as user {}
    }
  }
}

// => valid JSON input
// {
//   "name": "string",
//   "description": "string",
//   "user": {
//     "name": "string",
//     "email": "string"
//   }
// }
```


### Extra inputs

Gaudi can autogenerate request schema and validation rules based on target model's fields, but if you need input fields that do not corelate directly to target model, you can expand your request schema using `extra input`s block. In this block you can define completely arbitrary fields regardless of your model. These extra fields are part of the context and can be referenced within an action block.

```js
entrypoint Org {
  create endpoint {
    extra inputs {
      field foo { type string, validate { minLength(4) } }
    }
    action {
      // default action
      create {}
    }
  }
}

// => valid JSON input
// {
//   "name": "string",
//   "description": "string",
//   "foo": "string"
// }
```

## Validation

Since your actions use target model's fields, Gaudi knows everything about them and automatically generates field validations (e.g. type validation, required fields, ...).

```javascript
model Org {
  field name { type string, validate { minLength(4) and maxLength(64) }}
  field isPublic { type boolean }
}

// field "name" needs to be a string min 4 and max 64 characters long
// field "isPublic" needs to be a boolean
```

Gaudi will ensure every input passes validation rules and will throw an error otherwise.

You can write custom validation rules using [`validate` action](./actions.md#validation).