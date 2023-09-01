# Actions

## Customizing the endpoint action

If you want to extend the default endpoint behavior (required for `custom` endpoints), you can specify the `action` block.

```javascript
entrypoint Organization {
  create endpoint {
    action {
      // default `create` action for this endpoint
      create as org {}
      // assign current user as admin member of the org
      create org.memberships as member {
        set member @auth
        set role "admin"
      }
    }
  }
}
```
