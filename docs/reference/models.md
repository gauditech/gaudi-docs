---
sidebar_position: 1
slug: /reference/models
---

# Models

## Models

Model is a named group of fields which correspond to a database table. It consists of a name and a list of fields.

```js
model User {
  // ... fields
};
```

### Properties

##### `name`

A name of data model. It will be used as a database table name (in lowercase). This property is **required**.

## Fields

Fields are properties of model that correspond to columns in database tables.

### Properties

##### `name`

Defines a field name. This property is **required**.

```
field myFieldName { ... }
```

##### `type`

A primitive type identifier defining the type of the field. Available types: `string`, `integer`, `float` and `boolean`. This property is **required**.

```js
field rating {
  // highlight-next-line
  type integer
}
```

##### `dbname`

Defines a name of a corresponding table column. Optional, defaults to lower-cased value of field's `name` property (e.g. `"firstName"` property name will be converted to `"firstname"` dbname).

```js
field rating {
  // highlight-next-line
  dbname "user_rating"
}
```

##### `unique`

Marks a field as unique. This will create a unique constraint on the field in the database.
TODO: `unique` property also affects a compiler type checking in certain scenarios.

TODO: Learn more: [identify through, usage of "one"](../advanced-topics/actions.md#behavior-of-create-and-update-actions)

```js
field name {
  type string,
  // highlight-next-line
  unique
}
```

##### `nullable`

Marks the field as nullable. By default, fields are non-nullable which results in `NOT NULL` statement on a database level. `nullable` prevents such behavior and allows `NULL` values in target field.

```js
field deleted_at {
  type datetime,
  // highlight-next-line
  nullable
}
```

##### `default`

Defines a default field value. This makes the field optional (see [nullable](#nullable)) by default in create or update actions.
The type of a default value must match the field type.

```js
field rating {
  type integer,
  nullable,
  // highlight-next-line
  default 5
}
```

##### `validate`

Defines a validate expression. This is used to validate user-provided data during `create` and `update` actions.

```js
field slug {
  type string,
  unique,
  // highlight-next-line
  validate { alphanumeric() and minLength(6) and not reservedSlug() }
}
```

TODO: See data validation for more information about validators.

## References

A reference defines a relationship with another model. Internally, `reference` creates a `field` and a foreign key constraint in the database.

### Syntax

```js
model Book {
  reference owner { to Owner }
}
```

### Properties

##### `name`

A name of the reference in the data model. Gaudi will automatically create a field by appending a `_id` to a reference name. This property is **required**.

```js
reference org { ... }
// underlying field is automatically created by Gaudi:
// field org_id { type integer, ... }
```

##### `to`

Specify a model to create a relationship with.

```js
reference organization {
  // highlight-next-line
  to Organization
}
```

##### `unique`, `name`, `nullable`

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

##### `on delete`

You can pass an SQL "ON DELETE" clause. Supported options are:
- `on delete set null`
- `on delete cascade`

## Relations

Relation defines an opposite side of a `reference`. A `reference` should have **exactly one** corresponding relation.

#### Examples

```js
model User {
  ...
  // highlight-next-line
  relation posts { from Post, through author }
  ...
}
model Post {
  ...
  reference author { to User }
  ...
}
```

### Properties

##### `name`

Defines a name of the relation. References are not persisted to a database, so this is defined purely on an application level. This property is **required**.

```js
model User {
  // highlight-next-line
  relation posts { ... }
}
```

##### `from` and `through`

These point to a properties of a linked `reference`.
The following parameters must match:

- reference's parent model name must match relation's `from` property (e.g. `Post`)
- reference's `to` property must match relation's parent model name (e.g. `User`)
- reference's `name` property must match relation's `to` property (e.g. `author`)

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

`computed` properties are arithmetic expressions that calculate values on the fly, meaning its value is not persisted to the database but is available as a property on fetched model records. You can use them in `select` and `filter` blocks.

List of supported functions and operators: TODO show here or link to another page/section

### Syntax

```js
model User {
  computed <name> { <computed expression> }
}
```

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
  field first_name { type string }
  field last_name { type string }
  // highlight-next-line
  computed name_length { length(first_name + " " + last_name) }
}
```

## Hooks

Model hooks can be used to augment a record with data provided by custom code.

### Properties

#### `arg`

Passes a value to a hook context. It can be an expression or a query. If query omits `from`, it is sourced from the current record. This can be used to pass specific record fields to a hook.

:::tip
Check out [advanced data selection](../advanced-topics/actions.md#advanced-data-selection) guide to learn how to pass more complex data structures!
:::

##### Examples

```js
model User {
  field name { type string }
  hook uppercaseName {
    // query argument
    // highlight-next-line
    arg user query { select { name } }
    // expression arguments
    // highlight-next-line
    arg prefix "Name: "
    // highlight-next-line
    arg currentTime now()
    inline "prefix + user.name.toUpperCase() + ' at: ' + stringify(currentTime)"
  }
}
```

#### `inline`

Defines an inline Javascript expression that has access to data defined with `arg`. Cannot be used together with `source`.

See the example above.

#### `source`

Defines a function which will be called with provided arguments. Function accepts a single argument which is a map of values.

##### Examples

```js
model User {
  field name { type string }
  hook uppercaseName {
    arg user query { select { name } }
    arg prefix ", msc."
    // highlight-next-line
    source makeUpper from "hooks/strings.js"
  }
}
```

```js
// in strings.js
module.exports = {
  makeUpper: function (args) {
    return args.user.name + " " + args.prefix;
  },
};
```
