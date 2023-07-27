---
sidebar_position: 5
title: Hooks
---

# Hooks

Gaudi is able to integrate with custom code written in JavaScript.

To do so, a `runtime` needs to be defined.

```javascript
runtime MyJsRuntime {
  default
  path "./path/to/hooks"
}
```

This helps Gaudi resolve the source paths.

:::info
If you're using TypeScript, make sure to specify a path to compiled code, for example within `dist` directory.
:::

## Hooks

Once runtime is defined, you can write hooks. Typically, you'll have only one runtime. In case you define multiple, you either should mark one of them `default`, otherwise you'll have to specify which runtime to use:

```javascript
hook myModelHook {
  runtime MyJsRuntime
  arg value 41
  source runHook from "./examples.js"
}
```

## Inline and external hooks

You can write hooks in two different ways: `inline`, typically a one-liners, or `source` referencing a function defined in your `runtime` directory.

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
