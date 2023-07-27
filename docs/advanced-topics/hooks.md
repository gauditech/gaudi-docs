## Hooks

Hooks offer a way to expand your application **by writing custom code**. There are multiple types of hooks, you can read more about them in [Runtimes and hooks](./runtimes-hooks)

In models, `hook` property is used to enrich the model with custom data.

Here are some examples where you'd want to use model hooks:

### Custom data manipulation

Simplest use-case for hooks is data manipulation that may not be possible to describe using Gaudi.

```js
model User {
  field fullName { type string }
  hook fullNameAnsi {
    params {
      user: query { select { fullName } }
    }
    // removes all the non-ascii characters
    inline "user.fullName.replace(/[^\x00-\x7F]/g, '')"
  }
}
```

### Embed data from external sources

This may be databases or external APIs, for example:

```js
model User {
  field stripeId { type text }
  // highlight-start
  hook stripePaymentHistory {
    params {
      user: query { select { id, stripeId } }
    }
    // define your custom logic here
    source fetchUserPaymentHistory from "./hooks/stripe.js"
  }
  // highlight-end
}
```

Gaudi will invoke the `fetchUserPaymentHistory` only when needed. You can read more about Gaudi data retreival and computation logic HERE: TODO.
