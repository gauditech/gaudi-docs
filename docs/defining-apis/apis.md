---
sidebar_position: 1
sidebar_label: Defining APIs
title: Defining APIs
---

# Defining APIs

In Gaudi, REST APIs can be defined within `api` and `entrypoint` blocks.

## API blocks

`api` is a root-level block used to define REST API. It can have an optional name (which transforms into a namespace). Here are some examples:

```
api {} // url path prefix is /api/
api Admin {} // url path prefix is /api/admin/
```

## Entrypoints

`entrypoint` is a block that defines a set of endpoints operating on the same data relationship. Entrypoints can be nested. Outer-most `entrypoint` must target a `model`, while nested ones can target data relationships. Url path prefix is derived from the endpoint path.

Here's an example showcasing how to nest entrypoints:

```
api {
  entrypoint Post {
    entrypoint comments { // targets `Post.comments` relation
      entrypoint likes {} // targets `Comment.likes` relation
    }
  }
}
```

## Endpoints

Both `api` and `entrypoint` blocks don't do much without the `endpoint` specification.
`endpoint` builds into a REST API endpoint, and operates on a target relationship defined in the `entrypoint`.

Let's extend the previous example to include some endpoints:

```javascript
api {
  // /api/post/
  entrypoint Post {

    create endpoint {} // POST /api/post/
    list endpoint {}  // GET /api/post/
    get endpoint {} // GET /api/post/{postId}/

    // /api/post/{postId}/comments/
    entrypoint comments {

      // POST /api/post/{postId}/comments/
      create endpoint {}

      // GET /api/post/{postId}/comments/
      list endpoint {}

      // /api/post/{postId}/comments/{commentId}/likes/
      entrypoint likes {
        // POST /api/post/{postId}/comments/{commentId}/likes
        create endpoint {}

        // GET /api/post/{postId}/comments/{commentId}/likes
        list endpoint {}

        // DELETE /api/post/{postId}/comments/{commentId}/likes/{likeId}
        delete endpoint {}
      }
    }
  }
}
```

### CRUD endpoints

There are five different "crud" endpoints. The first two operate on a **collection** of data:

- `create endpoint`
- `list endpoint`

The other three operate on a **single** record within a collection. Those are:

- `get endpoint`
- `update endpoint`
- `delete endpoint`

### Custom endpoints

You can also define a custom endpoint.

Here's an example:

```javascript
api {
  entrypoint Post {
    custom endpoint {
      GET many /search // GET /api/post/search/
      GET one /statistics // GET /api/post/{postId}/statistics/
    }
  }
}
```

#### Difference between crud and custom endpoints

There are several differences between these two kinds of endpoints:

- crud endpoint always returns a target resource, respecting the `response` property
- crud endpoint method & path cannot be customized; custom endpoints must specify those parameters
- custom endpoint doesn't return any data by default - requires either a `hook` with `responds` flag or a `respond` action
  

## Customization

### Identify through
Typically, a single record is identified through an `id` field. This can be customized using `identify through`. This directive can be defined within an `entrypoint`:

```javascript
api {
  entrypoint User {
    identify { through profile.email }
    get endpoint {} // GET /api/user/{userProfileEmail}/
  }
}
```

the `through` relationship path has be **unique**. You can read more about how **unique path** is detected!

### response

`response` can be added to an `entrypoint`. It only affects **crud** endpoints. It defines which data is returned upon a successful request.

```javascript
api {
  entrypoint Post {
    response {
        id, title, message,
        comments {
            id, message, likeCount,
            author { id, profileUrl, username }
            }
        }
        author { id, profileUrl, username }
  }
}
```

### Actions

Each crud endpoint ships a default action, but the endpoint action block can be customized as needed. Custom endpoints don't have a defult action, therefore they always expect an explicit action definition.

:::info

Actions have a [dedicated page](./actions.md) where they are described in detail.
:::

#### Syntax

```javascript
create endpoint {
  action { // customize action block
    create as post { // overwrite a default implementation
      set user @auth // ensure `user` is a server-side setter
    }

    // create 
    create post.upvote as upvote {
      set user @auth
    }
  }
}
```
