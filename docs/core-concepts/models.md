---
sidebar_position: 1
title: Models
---

# Models

Gaudi provides a powerful data modeling language. You can describe your data models and relations using intuitive, human-readable and database agnostic language.

Modeling language consists of 2 core concepts, models and fields.

## Model

Model is a named group of fields which typically corresponds to a database table.

```
model User {
  // fields
}
```

## Fields

Fields can be divided in 4 categories

#### `field`

Fields are properties of model that correspond to columns in database tables. Here's an example:

#### `reference` and `relation`

Describe relationships between database tables, using foreign keys.

#### `query` and `computed`

`query` can be used to build complex, custom data relationships, which provide additional semantics which are not reflected in the database schema, but exist in a business domain, and can be helpful when querying the data.

Similarly, `computed` defines expressions which are primitive values (`field`-like), but are calculated on-the-fly and are not persisted in the database.

Both `query` and `computed` properties are also available in query expressions (filter, order by).

#### `hook`

Hooks are properties that can be used to enrich data models with data that cannot be calculated in a database, or are not supported natively via Gaudi language. They execute custom code and store results in the data model. They are similar to `computed` properties, but unlike them, `hook` properties are not available in query expressions.

## Overview (example)

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

<!--
 - TODO: add basic model validation
-->
