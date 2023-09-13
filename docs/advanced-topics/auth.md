# Auth

There is a special context alias - `@auth`, that contains a record of a currently logged-in user.

## Authentication

Gaudi supports authentication plugins which let you define authorization methods. Currently, only "basic" method exists.

```javascript
auth {
  method basic {}
}
```

## Authorization

Authorization rules can be defined using `authorize` block either on `entrypoint` or on `endpoint` level. It can contain any Gaudi expression which resolves to a boolean value. To access currently authenticated user use `@auth` context alias.

```javascript
api {
  entrypoint Topic {
    // only logged-in users can access topics
    authorize { @auth is not null }
    // only admins can create new topics
    create endpoint {
      authorize { @auth.profile.isAdmin is true }
    }
  }
}
```
