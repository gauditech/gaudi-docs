---
sidebar_position: 1
slug: /
---

# About Gaudi

## What is Gaudi?

Gaudi is a backend development framework powered by a declarative domain specific language (_DSL_) that makes it easier to build, run and maintain web applications. It is designed to keep developers productive during development.

With Gaudi, you can define your database schema using an intuitive, human-readable, database-agnostic language and expand it with advanced modeling concepts. Expose your data as simple CRUD REST endpoints with a few lines of code, customize their default behaviour or write completely custom endpoints. All using full declarativeness and type-safety of Gaudi, or even custom JS/TS code hooks.

Gaudi improves productivity and developer experience with a combination of features:

- language compiler with type checker to give you an early feedback on mistakes
- a declarative syntax designed to be easy to understanding, focusing on "what" rather than "how"
- development mode, in which a database is automatically kept in sync with the models defined with Gaudi, optionally automatically populated with dummy/test data
- automatic generation of OpenAPI specification with Swagger UI
- automatic generation of a JavaScript client library with TypeScript support, achieving a full stack type safety, while making it easier integrate Gaudi with JavaScript applications


## Why Gaudi?

Most web applications share similar structure. They have a database with a specific structure and some data, they want to expose subsets of data to their clients and the clients need to have a way to access it and consume it. This single sentence condenses several layer of web architecture, a lot of technologies and even more boilerplate code and configuration. Once all this is set up and an application is in production, the work is far from over. All those layers, technologies, boilerplate and configuration need to be maintained, improved and upgraded, over the years. This puts an unnecessary strain on any IT department, especially if your resources are constrained in any way.

Well, we've also been in this situation and that's why we've decided to build Gaudi, to solve this problem for us as well as for you. 🤛

Gaudi allows developers to "describe" an application in a declarative way without worrying about implementation details of the underlying technologies. It uses already known and well proven concepts like _models_, _queries_, _endpoints_, _CRUD_, ... so there is very little new mental concepts that you have adopt or change. We've just formalized this existing knowledge and made it a first-class citizen.

Here is an example of a Gaudi application.

```js title="bookreviews.gaudi"
model Author {
  field name { type string }
  field description { type string, nullable }
  // ... other fields
}

api {
  entrypoint Author {
    // all CRUD endpoints except DELETE
    create endpoint {}
    list endpoint {}
    get endpoint {}
    update endpoint {}
    // delete endpoint {}
  }
}
```

This is all you need to write. Just compile it and run using Gaudi and you'll get your database and endpoints running in no time. And ... that's it! 🎉

## Why a DSL?

To quote [Wikipedia](https://en.wikipedia.org/wiki/Domain-specific_language): _"A domain-specific language (DSL) is a computer language specialized to a particular application domain."_

Gaudi's goal is to collect common mental concepts and best practices used in web application development and make them a first-class citizen instead of just piles of imperative code we tend to group at our own convenience and call them _abstractions_.

To do that, Gaudi couldn't have been just _"another web development framework"_ it had to become _"web development domain language"_ as well. In it's core, Gaudi still is and will be a full fledged web framework, just a more powerful and smarter one.

## Gaudi is in pre-release

Gaudi is currently in pre-release which means, though we're working very hard to make Gaudi your next _go-to_ tool, there's still a good chance that you'll find some parts a bit rough or missing or changing without warning. Still, Gaudi is a fully functional web development framework with features like data modeling, type-safe query language, database migrations, REST APIs and automatically generated client library and that is not something that should be easily discarded.

We hope you'll forgive Gaudi these initial challenges and give it a go. We can't wait for you to try it and to here your thoughts and ideas! 🖖
