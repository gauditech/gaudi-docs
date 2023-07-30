---
sidebar_position: 5
---

# Hooks

Declarative approach is excellent for many use-cases but every once in a while, we simply need to resort to some specific imperative code (e.g. cryptography, payment, external tools and services, our own custom behavior, ...). This is where Gaudi hooks come in. They are the _"escape hatches"_ which allow you to use any JS custom code or library you need and run it inside Gaudi.

First, you need to defin a `runtime` which contains a path to your hooks folder.

```javascript
runtime MyJsRuntime {
  path "./path/to/hooks"
}
```

:::info
If you're using TypeScript, make sure to specify a path to compiled code, for example within `dist` directory.
:::

Once a runtime is defined, you can write hooks.

```javascript
hook myModelHook {
  // hook arguments
  arg value1 41 // literal value arg
  arg value2 newUser.name // context value arg

  // target hook name and source
  source runHook from "./examples.js"
}
```

## Inline and external hooks

You can write hooks in two different ways:

- `inline`, typically a one-liners,
- `source` referencing a function defined in your `runtime` directory.

### Inline hooks

Inline hook has access to args as if they were variables:

```javascript
hook {
  arg myValue 10
  inline "`value is ${myValue}`"
}
```

### External hooks

When you define a hook that loads external code:

```javascript
hook {
  arg myValue 10
  source getValue from "./examples.js"
}
```

A function (in this case `getValue`) accepts context (varies based on hook type), and arguments passed:

```javascript
export function getValue(ctx, args) {
  // using lodash lib using "_" global var
  return _.identity(args.myValue);
}
```

Make sure to `export` the function.

## Types of hooks

### Model hook

A model hook calculates a custom property on `model`. It can accept `query` as an argument, as well as normal expressions.

```javascript
model User {
  field fullName { type string }
  field paymentId { type string }
  hook paymentHistory {
    arg maxHistLength 10
    arg user query { select { id, paymentId } }
    source fetchHistory from "./stripe.js"
  }
}
```

### Setter hook

A setter hook can be executed as part of the `set` statement with `create` or `update` actions:

```javascript
create as org {
  set randomInt hook {
    inline "Math.floor(Math.random() * 1000)"
  }
}
```

### Execute hook

Execute hook has access to `request` and `response` objects, and is one of the supported actions.

```javascript
action {
  create as org {}
  execute {
    hook {
      arg orgId org.id
      inline "console.log(orgId)"
    }
  }
}
```

<!-- TODO: validator hook -->
