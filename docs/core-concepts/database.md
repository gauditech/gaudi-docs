---
sidebar_position: 6
---

# Database

One of Gaudi's primary goals is to provide developers with best possible tools and processes for handling database, both in development and production.

Gaudi comes with a powerful and expressive [data modeling syntax](./models), ensuring that your models serve as a single source of _truth_ for all types throughout your [APIs](./apis) and [integrations](./integrations.md)

However, a great modeling syntax is not the only area where Gaudi can assist you. Managing the database structure and data changes (also known as _migrations_) can be a tedious and error-prone process. To alleviate this, Gaudi offers a comprehensive set of database management tools through the [Gaudi CLI](../reference/cli.md), making this process as painless as possible.

This process can be divided in two different phases: development and production.

#### Development

This is where changes in database structure and data are very often and very iterative. Developers iterate and explore their ideas and often revert all or only parts of their changes and go into different direction or even jump between git branches with completely different database structures and accompanying data. In these circumstances, manually maintaining the database structure and the data can become a challenging task.

The key characteristic of this phase is the volatility of changes in both structure and data. The most viable approach is to embrace a strategy of _continuous recreation_ for both the structure **AND** the data.

Recreating the structure is straightforward. Whenever you make changes to your model, whether manually or by changing git branches, Gaudi will automatically apply those changes to your database.

The chellenge with recreating databases is potential loss of some or all data. This is where Gaud populator comes in. Populators use a Gaudi syntax simmilar to [APIs](./api) but instead of **exposing** your data, their purpose is to **create** your data. Therefore, when Gaudi recreates your database structure, it can simultaneously recreate your data. Both problems solved! :tada:

#### Example

```js
model Item {
    field name { type string }
    field description { type string, nullable }
}

// populator named "Dev"
populator Dev {
  // create 15 Item records
  populate Item as item {
      repeat as iter 15

      // set model props
      set name "Item " + stringify(iter.current)
      set description "Description of item " + stringify(iter.current)
  }
}
```

Applying "Dev" populator

```js
npx gaudi db populate -p Dev
```

If you need more that one dataset, you can create different populators for different situations, e.g.

- very few simple data for easier development,
- very strict data format for testing
- 1000s of real world but random data for UI testing or demoing to a client.
- ...

Furthermore, populators are a part of Gaudi source code so when e.g. switching between git branches, you don't need to be aware of database structure changes nor the data required to prefill your datbase. Just allow Gaudi to sync your model and data and you're up and running.

#### Production

Once development process comes to an end and changes to database structure have stabilized, it's time to prepare for their application to the production database.

Migration files are created by taking a "snapshot" of current database structure. Migration file is essentially an SQL script which will modify your database to match the latest structure. The reason this process is'nt' automated, unlike in the development phase, is because production data is **not** volatile and once lost it's not easily recoverable. By initially creating a migration file, you have the opportunity to revise proposed modifications and take action if necessary.

##### Creating migration file

```js
npx gaudi db migrate --name="changes_description"
```

This will create a migration file in your source folder. This file should be placed under source control and distributed with your application, allowing it to be replayed on the production database.

After deploying an application to production, it's essential to replay the migration files first to update the production database.

##### Applying changes to another database

```js
npx gaudi db deploy
```

Gaudi will compare the live database with expected structure described in models and migration files. If anything unexpected occurs, the process will be aborted. If all goes well, you have your new database and you can start your application.

#### Implementation

Gaudi leverages [Prisma](https://prisma.io) library for managing database migrations. Prisma is an excellent database library and provides a robust foundation for our current migration requirements. However, we're always looking for new and innovative ways to improve the database management experience. In the future, we may explore alternative options if they provide a smoother migration experience.
