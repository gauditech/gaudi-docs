---
sidebar_position: 2
sidebar_label: Data modeling
title: Data modeling
slug: /data-modeling
---


# Modeling data relationships

Gaudi provides a powerful data modeling language. We could split modeling language features into four groups:

#### 1.  `model` and `field`

These are the most basic, low level abstractions which allow users to define a database schema.

#### 2. `reference` and `relation`

Describe relationships between database tables, using foreign keys.

#### 3. `query` and `computed`

`query` can be used to build complex, custom data relationships, which provide additional semantics which are not reflected in the database schema, but exist in a business domain, and can be helpful when querying the data.

Similarly, `computed` defines expressions which are primitive values (`field`-like), but are calculated on-the-fly and are not persisted in the database.

#### 4. `hook`

Hooks are properties that can be used to enrich data models with data that cannot be calculated in a database, or are not supported natively via Gaudi language. They execute custom code and store results in the data model. They are similar to `computed` properties, but unlike them, `hook` properties are not available in query expressions (`filter`, `order by`).


### Overview (example)

Here is an example `model` that utilizes all supported kinds of properties. 

```js
model Organization {
    // define some fields
    // NOTE: field "id" is implicitly defined
    field name { type text }
    field stripeId { type text, unique }
    field numberOfEmployees { type integer, nullable }

    // create relationships with other models
    reference owner { to Owner }
    relation announcements { from Announcement, through organization }

    // calculate computed properties on the fly
    computed summary { "Organization " + name + " has " + count(members) + "members" }

    // query through data relationships
    // returns 5 latest announcements
    query recent_anonuncements {
        from announcements, order by { created_at desc }, limit 5
    }

    // invoke custom JavaScript code
    hook payment_history {
        set params query {
            select { id, stripeId }
        }
        source fetchPaymentInfo from "./hooks/stripe.js"
    }
}
```

## Fields

Fields are properties of model that correspond to columns in database tables. Here's an example:

```
...
  field username { type text, unique, validate { alphanumeric() } }
...
```

Let's break down the properties of a `field`:

### `name`

Defines a field name. This property is **required**.

```
field myFieldName { ... }
```

### `type`

A primitive type identifier defining the type of the field. This property is **required**.

```js
field rating {
  // highlight-next-line
  type integer
}
```

### `dbname`

Defines a name of a corresponding table column. Optional, defaults to the value of fields `name` property if not provided.

```js
field rating {
  // highlight-next-line
  dbname "user_rating"
}
```

### `unique`

Marks a field as unique. This will create a unique constraint on the field in the database.
TODO: `unique` propery also affects a compiler type checking in certain scenarios. Learn more.
identify through, usage of "one"

```js
field name {
  type text,
  // highlight-next-line
  unique
}
```

### `nullable`

Marks the field as nullable. Non-nullable fields specify `NOT NULL` on a database level.
`nullable` prevents such behavior.

```js
field deleted_at {
  type datetime,
  // highlight-next-line
  nullable
}
```

### `default`

Defines a default value. This makes the field optional by default in create or update actions.
The type of a default value must match the field type.

```js
field rating {
  type integer,
  nullable,
  // highlight-next-line
  default 5
}
```

### `validate`

Defines a validate expression. This is used to validate user-provided data during `create` and `update` actions.

```js
field slug {
  type text,
  unique,
  // highlight-next-line
  validate { alphanumeric() and minLength(6) and not reservedSlug() }
}
```

TODO: See data validation for more information about validators.

## References

A reference defines a relationship with another model. Internally, `reference` creates a `field` and a foreign key constraint in the database.

Example definition:

```
...
reference owner { to Owner }
...
```

Let's break down the properties of `reference`:

### `name`

A name of the reference in the data model. Gaudi will automatically create a field by appending a `_id` to a reference name. This property is **required**.

```js
reference org { ... }
// underlying field is automatically created by Gaudi:
// field org_id { type integer, ... }
```

### `to`

Specify a model to create a relationship with.

```js
reference organization {
  // highlight-next-line
  to Organization
}
```

### `unique`, `name`, `nullable`

Reference accepts certain properties that are passed through to an underlying `field` property that reference creates. The following properties are allowed in `reference`:
- `unique`
- `nullable`
- `dbname`

```js
reference organization {
  through Organization,
  // highlight-next-line
  dbname "orgId", nullable
}
```

## Relations

Relation defines an opposite side of a `reference`. A `reference` should have **exactly one** corresponding relation.

Example:

```js
model User {
  ...
  // highlight-next-line
  relation posts { from Post, through author }
  ...
}
model Post {
  ...
  reference user { to User }
  ...
}
```

Properties:

### `name`

Defines a name of the relation. References are not persisted to a database, so this is defined purely on an application level. This property is **required**.

```js
model User {
  // highlight-next-line
  relation posts { ... }
}
```

### `from` and `through`

These point to a properties of a linked `reference`.
The following parameters must match:

- (`reference` -> *model name*) must match (`relation` -> `from`)
- (`reference` -> `to`) must match (`relation` -> *model name*)
- (`reference` -> `name`) must match (`relation` -> `through`) 

```js
model Post {
  reference author { to User }
}

model User {
  relation posts {
    from Post, through author
  }
}
```

## Computeds

`computed` properties are arithmetic expressions that calculate values on the fly, meaning its value is not persisted to the database. You can use them in `select` and `filter` blocks.

List of supported functions and operators: TODO show here or link to another page/section

### Examples

#### Exposing primitive values from other tables

You can traverse through "cardinality:one" relationships and expose primitive values (`field` or `computed`).

```js
model User {
  reference profile { to Profile }
  // highlight-next-line
  computed avatarUrl { profile.avatarUrl }
}
```

#### Aggregate functions

You can invoke aggregate functions on "cardinality:many" relationships.

```js
model User {
  relation posts { to Post }
  // highlight-next-line
  computed postCount { count(posts) }
}
```

#### Arithmetic expressions

You can evaluate arithmetic expressions...

```js
model User {
  relation posts { to Post }
  query latestPosts { from posts, order by { id desc }, limit 10 }
  // highlight-next-line
  computed honourPoints { count(latestPosts) * 2 + sum(posts.upvotes) }
}
```

...or manipulate text:

```js
model Users {
  field first_name { type text }
  field last_name { type text }
  // highlight-next-line
  computed name_length { length (first_name + " " + last_name)}
}
```


## Queries

You can build complex data relationships using `query` properties. You can `filter` the relationships or slice them using `limit` and `offset` with `order by`.

:::tip

`filter` and `order by` work with `field`s, `computed`s or inline expressions.

:::

With `query`es, your data model can understand concepts such as `active_users`, `public_repositories`, `pending_applications` or `top_5_members`, which can then later be used when querying the database.

Here are some examples:

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

`query` supports multiple properties:

### `from`

`from` can point to another property in the model, as well as traverse through data model.

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

### `filter`

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

### `Order by`, `limit` and `offset`

Let's expand the example from the section above (TODO link)

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

## Hooks

Hooks offer a way to expand your application **by writing custom code**. There are multiple types of hooks, you can read more about hooks in general HERE (TODO)

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

### Custom business logic

Consider the following example:

```js
model ChessGame {
  reference playerWhite { to User }
  reference playerBlack { to User }

  relation moves { from GameMove, through game }

  // highlight-start
  hook currentBoard {
    params {
      moves: query { from moves, order by { id asc } }
    }
    source calculateBoardFromMoves from "./hooks.js"
  }
  // highlight-end
}

model GameMove {
  reference game { to Game }
  field playerColor { type string, validate { oneOf(["white", "black"]) }}
  field move { type string } // algebraic notation
}
```

The application is keeping track of chess game moves. They are stored in an "algebraic notation", which means every move is a string. You can implement a custom function `calculateBoardFromMoves` that converts a list of moves into a 2D representation of a game board.