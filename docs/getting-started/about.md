---
sidebar_position: 1
slug: /
---

# About Gaudi

## What is Gaudi?

Gaudi is an open source declarative domain specific language (_DSL_) and a backend development framework that makes it easier to build, run and maintain web applications.

With Gaudi, you can define your database schema using intuitive, human-readable language and database agnostic language and expand it with advanced modeling concepts.

Gaudi is designed to keep you productive during development. Whether you're just iterating your ideas, or switching between Git branches with completely different database models, your database will automatically be kept in sync and populated with the appropriate data.

You can expose your data as a simple CRUD REST endpoint with a single line of Gaudi code. Customize default CRUD behavior or go beyond CRUD and write completely custom endpoints using full declarativeness and type-safety of Gaudi or even custom code hooks.

// TODO: what is gaudi image or video about gaudi (simple explanation)

# Why Gaudi?

Most web application share similar structure. They have a database with some structure and some data, they want to expose those data to their clients and the clients need to have a way to access it and consume it. This single sentence condenses several layer of web architecture, a lot of technologies and even more boilerplate code and configuration. Once all this is set up and an application is in production, the work is far from over. All those layers, technologies, boilerplate and configuration need to be maintained, improved and upgraded, over the years. This puts an unnecessary strain on any IT department, especially if your resources are constrained in any way.

Well, we've also been in this situation and that's why we've decided to build Gaudi, to solve this problem for us as well as for you. 🤛

Gaudi allows developers to "describe" an application in a declarative way without worrying about implementation details of the underlying technologies. It uses already known and well proven concepts like _models_, _queries_, _endpoints_, _CRUD_, ... so there is very little new mental concepts that you have adopt or change. We've just formalized this existing knowledge and made it a first-class citizen.

Here is an example of a Gaudi application.

```js title="bookreviews.gaudi"
model Author {
  field name { type string }
  field description { type string, nullable }
  // ... other fields
}

entrypoint Author {
  // all CRUD endpoints except DELETE
  create endpoint {}
  list endpoint {}
  get endpoint {}
  update endpoint {}
  // delete endpoint {}
}
```

This is all you need to write. Just compile it and run using Gaudi and you'll get your database and endpoints running in no time. And ... that's it! 🎉

## Why DSL?

To quote [Wikipedia](https://en.wikipedia.org/wiki/Domain-specific_language): _"A domain-specific language (DSL) is a computer language specialized to a particular application domain."_

Gaudi's goal is to collect common mental concepts and best practices used in web application development and make them a first-class citizen instead of just piles of imperative code we tend to group at our own convenience and call them _abstractions_.

To do that, Gaudi couldn't have been just _"another web development framework"_ it had to become _"web development domain language"_ as well. In it's core, Gaudi still is and will be a full fledged web framework, just a more powerful and smarter one.

## Gaudi is in pre-release

Gaudi is currently in pre-release which means, though we're working very hard to make Gaudi your next _go-to_ tool, there's still a good chance that you'll find some parts a bit rough or missing or changing without warning. Still, Gaudi is a fully functional web development framework with features like data modeling, type-safe query language, database migrations, REST APIs and automatically generated client library and that is not something that should be easily discarded.

We hope you'll forgive Gaudi these initial challenges and give it a go. We can't wait for you to try it and to here your thoughts and ideas! 🖖
