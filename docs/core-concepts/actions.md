---
sidebar_position: 3
title: Actions
---

# Actions

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

## Context

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

### Context and aliases

Each `entrypoint` can specify the alias using `as` attribute. An alias from the context is visible in single-cardinality endpoints, as well as in nested entrypoints.

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

Aliases from the context can be referenced within `authorize` or `action` blocks.

---

### Fieldsets

Fieldset is a collection of user inputs for a specific endpoint. This describes a JSON data structure an endpoint expects in a HTTP body.

Fieldsets are generated automatically based on endpoint actions and extra inputs. This means that Gaudi will go through all your actions, collect all fields that they use and automatically generate schema of input required by your endpoint.

If your actions use target model's fields, Gaudi knows evenrything about them and can automatically generate proper validations. If you need custom fields that do not corelate directly to the fields in target model, you can override some properties of your fields (eg. add default value) or even use `extra input`s to describe completely arbitrary fields.

<!-- TODO: describe inputs, extra inputs and sets -->

## Validation

Every `input` derived from `field` in `create`, `update` or `extra inputs` inherits the `validate` blocks specified within a field.

```javascript
model Topic {
  field name { type string, validate { minLength(4) and maxLength(64) }}
}
```

Gaudi will ensure every `input` passes it's `field`'s validation rules.

### How is schema calculated

Inputs from `create` and `update` actions are namespaced with the action alias.

```javascript
update org as newOrg {} // inputs are namespaced under "newOrg"
```

Inputs derived from `extra inputs` don't have a namespace.

#### Create actions

By default, a `field` belonging to a model of a target action will be included if:

- it's not an `id` field
- doesn't have `default` value
- is not `set` within action block

You can force a field with a `default` value by explicitly using the `input` directive:

```javascript
create as org {
  input { status { required } }
}
```

If the `required` keyword is ommited, this input will be optional, since it a default value is known.

You can also explicitly set a default value for any input:

```javascript
create as org {
  input { status { default true } }
}
```

#### Update actions

For security reasons, every updateable field must be explicitly specified:

```javascript
update as org {
  input { status, name, logoUrl }
}
```

With `update`, all inputs are optional, unless `required` is set. `default` is not supported in updade actions.

#### Extra inputs

Every `field` specified inside `extra inputs` goes into a root of the schema. It's required, unless `default` is provided.

```javascript
create endpoint {
  extra inputs {
    field passwordRepeat { type string }
    field subscribedToNewsletter { type boolean, default false }
  }
}
```
