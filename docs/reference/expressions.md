---
sidebar_position: 6
---

# Expressions

Expressions can be used in various places, such as:

- `set` properties of create and update action
- `authorize` rules
- `default` values in fields and inputs
- `computed` properties
- `select`

## Primitive values

```js
computed five { 5 }
computed fiveStr { "five" }
```

## Operators

```js
computed fullName {
  firstName + " " + lastName
}
computed isValidStatus {
  status in ["active", "pending", "failed", "succeeded"]
}
```

### Supported operators

- `+` for string concatenation
- `+`, `-`, `/`, `*`, a number arithmetics
- `and`, `or` for boolean expressions
- `is`, `is not` for comparison between values of a same type
- `in`, `not in`, checks for existence of a value in an array of elements or records

## Functions

```js
computed charCount {
  length(fullName)
}
```

### Supported functions

- `length`, calculates a length of a string value
- `lower`, lowercases a string value
- `upper`, uppercases a string value
- `now`, returns an integer - UNIX timestamp at the time of execution
- `stringify`, turns anything into text using JSON serializer
- `count`, returns a number of records in a collection
- `sum`, sums a value of a column within a collection
