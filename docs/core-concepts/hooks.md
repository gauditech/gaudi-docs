---
sidebar_position: 5
---

# Hooks

Declarative approach is excellent for many use-cases but every once in a while, we simply need to resort to custom imperative code (e.g. cryptography, payment, external tools and services, our own custom behavior, ...). This is where Gaudi hooks come in. They are the _"escape hatches"_ which allow you to use any JS custom code or library you need and while still running it inside Gaudi.

First, you need to define a `runtime` which contains a path to your hooks folder.

```javascript
runtime MyJsRuntime {
  path "./path/to/hooks"
}
```

:::info
This folder is relative to current working directory so make sure you matches your runtime settings.
:::

Once a runtime is defined, you can add some hooks.

## Hooks types

You can write hooks in two different ways:

- `inline` - typically, simple one-liners,
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
export function getValue(args) {
  // using lodash lib using "_" global var
  return _.identity(args.myValue);
}
```

Make sure to `export` the function.

## Hooks usage

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

Execute hook has context with access to  `request` and `response` objects. It can be used within endpoint `action` block.

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
