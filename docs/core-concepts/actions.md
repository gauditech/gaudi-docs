---
sidebar_position: 3
---

# Actions

## About actions

Actions are the real "units of work" in Gaudi. Both `entrypoint`s and `endpoint`s basically just create a context in which `action`s are executed. Actions are defined inside endpoints and each endpoint can have one or more actions. They are declarative, but their ordering matters, which also makes them somewhat imperative.

Gaudi supports several [types of action](../reference/actions) which define the behavior of an endpoint. Built-in endpoints (iow. all except `custom` endpoints), if not specified otherwise, contain an implicit action that matches their type. E.g. `create` endpoint contains `create` action etc. Custom endpoints contain no implicit actions so they require at least one explicite action.

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

Each action requires a model it works on. By default, target model is optional and defaults to the current action's `entrypoint` target model. If you need to work with other models (e.g. create, update, fetch, ...) in the same request, then `<target model>` can be used to indicate which model the action is targeting.

Action can define an `alias` using `as` keyword. If the action returns a value (e.g. fetches, creates or updates a record), this value can later be accessed via that alias. More on aliases in [context](#context) section.

Endpoint actions example

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

## Context

Actions usually need some data to work with; they receive some data on the input and return some data on the output. This data comes from action's _"context"_. Context is an environment created by action's parent `entrypoint` and `endpoint`. It is something like a namespace or a map that can store and return values. It is used to stored data required and provided by actions, such as URL parameters, input body and outputs from previous actions.

### Context and aliases

If an action returns a result, that result is stored in the context, and is available to subsequent actions. If an action defines an alias, result is stored and can be accessed by the name defined by the alias. Aliases stored in the context are immutable and cannot be overwritten by the subsequent actions.

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

Each `entrypoint` can also specify an alias using `as` attribute. This alias will be used as a default alias for _target_, depending on the [endpoint type](./apis#identifying-specific-records).

Nested entrypoints create nested context. Aliases created in parent xontexts are visible in child contexts. Shadowing of aliases in parent contexts is not allowed and an error will be thrown.

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
    }
  }
}
```

## Fieldsets

Fieldset is a collection of fields that describe a JSON data structure an endpoint expects as an input value. Since each Gaudi action has a target model it works with, Gaudi can automatically generate expected fieldsets for all the actions in an endpoint.

Not all endpoints require a fieldset so Gaudi creates it only for those that do support it. Currently, it is created for: `create`, `update` and `custom` endpoints.

### Default inputs

Gaudi generates a fieldset from all fields of target model. For example, "create" endpoint contains a default "create" action and it works with `Org` model so it contains all of it's fields.

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

If an endpoint contains more than a default action, then a fieldset is constructed of all of their models. Fields of non-default actions are always namespaced in action's alias to avoid name collision between different models. that means that alias is required for all non-default actions.

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

### Validation

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

### Extra inputs

Gaudi can autogenerate fieldsets and validation based on target model's fields, but if you need input fields that do not corelate directly to target model, you can expand your fieldset using `extra input`s block. In this block you can define completely arbitrary fields regardless of your model. These extra fields can be used in manual inputs

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

or even use `extra input`s to describe completely arbitrary fields.

### Manual fields

Fieldsets describe what user input to an endpoint must look like since this is the data that action expects. If not specified otherwise, fieldset contains all of target model's fields and expects them in a user input.

But sometimes, there are fields we do not want to take from user input directly or at all. To do that you can define a manual `setter` for those fields in your action.

```js
entrypoint Org {
  create endpoint {
    action {
      create {
        // force organizations to be created with "isPublic" field set to "true"
        set isPublic true
      }
    }
  }
}
```

Since you're setting these fields yourself, they will not appear in fieldsets but will be injected by Gaudi before passing it to action.

Here's another example of using extra fields for manual setters

```js
entrypoint User {
  create endpoint {
    extra inputs {
      field firstName { type string, validate { minLength(1) } } }
      field lastName { type string, validate { minLength(1) } } }
    }

    action {
      create {
        // construct "name" proprty from extra fist/last name properties
        set name firstName + " " + lastName
      }
    }
  }
}
```
