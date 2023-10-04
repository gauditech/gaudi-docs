---
sidebar_position: 5
---

# Hooks

Declarative approach is excellent for many use-cases but every once in a while, we simply need to resort to custom imperative code (e.g. cryptography, payment, external tools and services, our own custom behavior, ...). This is where Gaudi hooks come in. They are the _"escape hatches"_ which allow you to use any JS custom code or a library you need and run it inside Gaudi.

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

## Hook types

You can write hooks in two different ways:

- `inline` - typically, simple one-liners,
- `source` - referencing a function defined in your `runtime` directory.

### Inline hooks

Inline hooks contain entire code inlined inside a string. They have access to args as if they were variables.

```javascript
hook {
  arg myValue 10
  inline "`value is ${myValue}`"
}
```

### External hooks

External hooks are located in outside, typically native, files (e.g. `.js` files) and are only referenced inside Gaudi code. This allows you to use native language tools when writing hooks while still using them inside Gaudi.

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

Make sure to `export` hooks functions so Gaudi can find them.

## Hooks usage

Hooks can be used in several places.

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

### Execute action hook

Execute action hook is a way to define an action using completely custom JS code. Execute hook has a context with access to `request` and `response` objects.

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
