---
sidebar_position: 1
slug: /core-concepts/models
---

# Models

Gaudi provides a powerful data modeling language. You can describe your data structure and relationships using intuitive, human-readable and database agnostic language.

## Model

Model is a named group of properties which typically corresponds to a database table.

```
model User {
  // ... properties
}
```

Model can specify a couple of different kinds of properties: `field`, `reference`, `relation`, `computed`, `query` and `hook`. These properties can be referenced in other parts of the code.

## Field

Fields are properties of a model that correspond to columns in database tables.

Fields can store only primitive values and can have data validation properties (e.g. `nullable`, `required`, `validate`)

```js
model Organization {
  // "name" property
  field name { type string }
}
```

## Reference and relation

References and relations are properties that describe relationships between models. Relationships allow you to traverse your data model and implicitly apply parent-child filters when querying your data. They can be used to fetch but also to modify related data when reading or modifying data in database, respectively.

In database, relationships correspond to using foreign keys and/or join tables, depending on the relation type.

```js
model Organization {
  // create relationships with other models
  reference owner { to Owner }
}

model Owner {
  // complements "Organization.owner" reference
  relation org { from Organization, through owner}
}
```

## Query

Queries are properties written in Gaudi's query language and can be used to additionaly query current model's relationships or other models. They can be used to build custom relationships between models which provide additional semantics not reflected in the database schema, but that exists in a business domain.

```js
model Organization {
  // returns 5 latest announcements
  query recent_anonuncements {
    from announcements, order by { created_at desc }, limit 5
  }
}
```

## Computed

Similarly, `computed` properties are written using Gaudi's expression but can resolve only to primitive values (`field`-like), but are calculated on-the-fly and are not persisted in the database.

Computed properties can use any model property to calculate a new value, as long as it results in a primitive value.

```js
model Organization {
  // calculate computed properties on the fly
  computed summary { "Organization " + name + " has " +
                    count(announcements) + " announcements" }
}
```

:::tip
`computed` properties can be used in query expressions (`filter`, `order by`).
:::

## Hook

Hooks are properties that can be used to enrich data models with data that cannot be calculated in a database, or are not supported natively via Gaudi language. They execute custom code and store results in the data model.

They are similar to `computed` properties, but unlike them, `hook` properties are not available in query expressions.

## Example overview

Here is an example model that utilizes all supported kinds of properties.

```js
model Organization {
  // standard fields
  // NOTE: field "id" is implicitly defined
  field name { type string }
  field stripeId { type string, unique }
  field numberOfEmployees { type integer, nullable }

  // create relationships with other models
  reference owner { to Owner }
  // complements "Announcement.org" reference
  relation announcements { from Announcement, through organization }

  // calculate computed properties on the fly
  computed summary { "Organization " + name + " has " + count(announcements) + " announcements" }

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

model Owner {
  // complements "Organization.owner" reference
  relation org { from Organization, through owner}

  // ... other fields
}

model Announcement {
  reference org{ to Organization, unique }

  // ... other fields
}
```
