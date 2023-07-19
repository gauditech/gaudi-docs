---
sidebar_position: 1
sidebar_label: Defining APIs
title: Defining APIs
---

# Defining APIs

## Overview

Gaudi lets you create REST APIs. They are designed to offer a predictable behavior with very little code, which can be customized when needed, or extended with `hooks`.

Gaudi can generate OpenAPI specification and client integration libraries that help you try out, test and integrate your API from day one.


### Defining endpoints

The concept of an API revolves around `entrypoint` and `endpoint` blocks. An entrypoint is a group of endpoints which operate on the same data source.

Endpoints represent specific REST endpoints. Gaudi supports five "built-in" endpoints, and a custom one:
- `create` endpoint
- `list` endpoint
- `get` endpoint
- `update` endpoint
- `delete` endpoint
- `custom` endpoint

Here is a short example of an api specification:

```javascript
api {
  entrypoint Topic {
    create endpoint {} // POST /api/topic/
    get endpoint {}    // GET /api/topic/{id}/
    custom endpoint {  // POST /api/topic/search/
      POST many "/search"
      ...
    }
    custom endpoint {  // POST /api/topic/{id}/disable/
      POST one "/disable"
      ...
    }
  }
}
```

### Identifying specific records

Some endpoints operate on a whole collection of records, such as:
- `create` endpoint
- `list` endpoint
- `custom` endpoint with `many`

Others operate on a single record, such as:
- `get` endpoint
- `update` endpoint
- `delete` endpoint
- `custom` endpoint with `one`

In order to look up a specific record, by default Gaudi expects a record `id` in the URL path. This can be customized using `identify` property:

```
entrypoint Topic {
  identify { through name }
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

### Authentication

Gaudi supports [authentication plugins](./auth) which let you define authorization methods.

```javascript
auth {
  method basic {}
}
```

There is a special context alias - `@auth`, that contains a record of the currently logged-in user.

### Authorization

You can define `authorize` block either per `endpoint` or an `entrypoint`.

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

### Specifying the response schema

You can use `response` block to define the schema of the data returned in the HTTP response body. `response` can be specified per `entrypoint` or per `endpoint`.


```javascript
api {
  entrypoint Topic {
    response { id, title, author { id, username, profile { imageUrl } } }
  }
}
```

By default, all the fields on the target model will be included. This also happens when you specify a nested relationship without its own block, eg:

```
response { id, title, author }
```

includes all the fields found in `author`.

### Customizing the endpoint action

If you want to extend the default endpoint behavior (required for `custom` endpoints), you can specify the `action` block.

```javascript
entrypoint Organization {
  create endpoint {
    // default `create` action for this endpoint
    create as org {}
    // assign current user as admin member of the org
    create org.memberships as member {
      set member @auth
      set role "admin"
    }
  }
}
```

:::info
You can read more about actions on a dedicated page - [Actions reference](./actions)
:::

### Request body schema

Endpoints that contain `create` or `update` actions may need to accept certain values from the client, via request body; as well as endpoints which contain `extra inputs` directives.

Gaudi analyses the endpoint specification and computes the desired schema. This can be seen in OpenAPI specification, as well as in client integration libraries.

#### How schema is calculated

Inputs from `create` and `update` actions are namespaced with the action alias.

```javascript
update org as newOrg {} // inputs are namespaced under "newOrg"
```

Inputs derived from `extra inputs` don't have a namespace.

##### Create actions

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

##### Update actions

For security reasons, every updateable field must be explicitly specified:

```javascript
update as org {
  input { status, name, logoUrl }
}
```

With `update`, all inputs are optional, unless `required` is set. `default` is not supported in updade actions.

##### Extra inputs

Every `field` specified inside `extra inputs` goes into a root of the schema. It's required, unless `default` is provided.

```javascript
create endpoint {
  extra inputs {
    field passwordRepeat { type string }
    field subscribedToNewsletter { type boolean, default false }
  }
}
```

### Validation

Every `input` derived from `field` in `create`, `update` or `extra inputs` inherits the `validate` blocks specified within a field.

```javascript
model Topic {
  field name { type string, validate { minLength(4) and maxLength(64) }}
}
```
You can also define a custom `validate` action:

```javascript
extra inputs {
  field passwordRepeat { type string }
}
action {
  create as org {}
  validate with key "passwordRepeat" {
    assert { passwordRepeat is org.password }
  }
}
```


## Example


```javascript
// minimal example
api {
  // movie is a model
  entrypoint Movie {
    // data returned in the HTTP response body
    response { id, slug, title, year, avgRating }

    // GET /api/movie/{movieId}
    get endpoint {}

    // POST /api/movie/
    create endpoint {
      authorize { @auth.user.isAdmin }
    }

    // a custom endpoint
    custom endpoint {
      // POST /api/movie/search/
      POST many "/search"

      extra inputs {
        field titleSearch { type string, validate { minLen(4) and maxLen(256) } }
      }

      action {
        query as results {
          from Movie as m,
          filter { startsWith(m.title, titleSearch) },
          limit 100,
          order by { avgRating desc },
          select { id, slug, title, year, avgRating, totalRatings }
        }
        respond { body results }
      }
    }
  }
}
```