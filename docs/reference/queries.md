---
sidebar_position: 4
---

# Queries

## Queries

You can build complex data relationships using `query` properties by filtering these relationships using `filter` or slicing them using `limit` and `offset` with `order by`.

:::tip

`filter` and `order by` work with `field`s, `computed`s or inline expressions.

:::

With `query`es, your data model can understand concepts such as `active_users`, `public_repositories`, `pending_applications` or `top_5_members`, which can then later be used when querying the database.

### Syntax

```js
model Users {
  relation posts { from Post, through author }
  // highlight-start
  query public_posts { from posts, filter { is_public } }
  query top_5_posts {
    from public_posts,
    filter {
      count(upvotes) > count(downvotes) * 5
      and count(upvotes) > 50
    },
    order by { count(upvotes) desc },
    limit 5
  }
  // highlight-end
}
```

### Properties

##### `from`

`from` can traverse through data model's relationships or even query from other `query` properties in the model.

The following example traverses through a many-to-many relationship `Membership` and exposes `org.members` which resolves to a `User` model.

```js
model User { ... }
model Membership {
  reference user { to User }
  reference org { to Org }
}

model Org {
  relation memberships { from Membership, through org }
  query members {
    // highlight-next-line
    from memberships.user
  }
}
```

##### `filter`

`filter` can be used to filter relationships based on other properties.

```js
model Post {
  reference author { to User }
  field isPublic { type boolean }
}
model User {
  relation posts { from Post, through Author }
  query publicPosts {
    from posts,
    // highlight-next-line
    filter { isPublic is true }
  }
}
```

#### `order by`, `limit` and `offset`

Let's expand the example from the section [above](#filter)

```js
model Post {
  reference author { to User }
  field isPublic { type boolean }
}

model PostUpvote {
  reference post { to Post }
  reference voter { to User }
}

model User {
  relation posts { from Post, through author }
  query publicPosts {
    from posts,
    filter { isPublic is true }
  }
  query mostUpvotedPublicPosts {
    from publicPosts,
    // highlight-start
    order by { count(upvotes) desc },
    limit 10
    // highlight-end
  }
}
```
