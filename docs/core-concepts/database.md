---
sidebar_position: 6
---

# Database

One of Gaudi's main missions is to provide developers with best possible tools and processes for handling databases both in development as in production.

Gaudi comes with a powerfull and expressive [data modeling syntax](./models) and makes sure your models are a _single source of truth_ for all types throughout your [APIs](./apis) and [integrations](./integrations.md)

Great modeling syntax is not the only thing where Gaudi can help you. Database structure and data changes (aka _migrations_) are very tedious and error prone process. Gaudi tries to make this process as painless as possible by providing a set of database management tools via [Gaudi CLI](../reference/cli.md)

This process can be divided in two different phases: development and production.

#### Development

This is where changes in database structure and data are very often and very iterative. Developers iterate and explore their ideas and often revert all or only parts of their changes and go into different direction. Developers sometimes even jump between git branches with completely different database structures and accompanying data. In these circumstances, manually maintaining database structure and data can be a _living hell_.

Main characteristic of this phase is that changes in structure and data are volatile and we can only accept the strategy of _continuous recreation_. Both structure **AND** data.

Structure recreations are rather straight-forward. Simply anytime you make a change in your model, manually or change a git branch or revert a file in your IDE, Gaudi will automatically apply those changes to your database.

The problem with recreating databases is that some or all data gets lost. This is where Gaud populator comes in. Populators are a Gaudi syntax simmilar to [APIs](./api) but instead of **exposing** your data it's purpose is to **create** your data. So, when Gaudi recreates your database structure, now it can recreate your data as well. Both problems solved! :tada:

```js
model Item {
    field name { type string }
    field description { type string, nullable }
}

populator Dev {
  // create 15 Item records
  populate Item as item {
      repeat as iter 15

      set name "Item " + stringify(iter.current)
      set description "Description of item " + stringify(iter.current)
  }
}
```

Applying "Dev" populator

```js
npx gaudi db populate -p Dev
```

If you need more that one dataset, you can create different populators for different situations, eg.

- very few simple data for easier development,
- very strict data format for testing
- 1000s of real world but random data for UI testing or demoing to a client.
- ...

Moreover, populators are a part of Gaudi source code so when eg. changing git branches, you don't need to be aware of database structure changes nor the data required to prefill your datbase. Simply let Gaudi sync your model and data and you're up and running.

#### Production

Once development process comes to an end and changes to database structure are settled down, we need to prepare for applying them to our production database.

Gaudi allows you to take a "snapshot" of current database structure and create a migration file. Migration file is an SQL script with changes that will modify your production database to the lates image. The reason why this process is not automatic like in development is because production data is **not** volatile and once lost data cannot be receovered easily. By first saving changes to a migration file gives you an opportunity to revise propsed changes and act upon them id necessary.

```js
npx gaudi db migrate --name="changes_description"
```

This will create a migration file in your source folder and this file should be source controlled and distributed with your application so it can be replayed on production database.

Once an app is deployed on production, you must first replay migration files to update production database.

```js
npx gaudi db deploy
```

Gaudi will compare live database with expected structure described in models and migration files and abort if anything unexpected accurs. If all goes well, you have your new database and you can start your application.
