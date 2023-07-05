---
sidebar_position: 1
sidebar_label: About Gaudi
title: About Gaudi
slug: /
---

## Introduction

Gaudi is a declarative programming language and a backend development framework that makes it easier to build and maintain web applications.

Some of its design goals include:

- increase the productivity of developers
- reduce technical debt and the amount of boilerplate code
- simplify security and data migrations
- offer powerful, fast and simple data querying engine
- simplify integration of client apps with the backend
- allow seamless integration between different programming languages

Additionally, due to it's declarative syntax and a domain-specific language features, Gaudi is able to understand the intention behind the code. This in turn enables us to simplify and automate both tedious and repetitive code, as well as complex workflows.

Some examples of such workflows include:
- automatic database query caching and cache invalidation
- zero-downtime database migrations
- automatic GraphQL and live pub/sub interfaces built from REST API definition
- auto-generated documentation, tests, and more

## How does it look like?

Here's a short application described with Gaudi. Can you figure out how it works?

```
auth {
  method basic {}
}

model Post {
  reference author { to AuthUser, on delete set null }
  field isPublic { type boolean, default true }
  field isVerified { type boolean, default false }
  field message { type string, validate { minLength(4) and maxLength(10000) } }
  relation comments { from Comment, through parentPost }
}

model Comment {
  reference parentPost { to Post, on delete cascade }
  reference author { to AuthUser, on delete set null }
  field message { type string, validate { minLength(4) and maxlength(10000) } }
}

api {
  authorize { @auth.id is not null }

  entrypoint Post as post {

    response {
      id,
      author { id, username },
      isVerified,
      message,
      comments { id, author { id, username }, message }
    }

    list endpoint {
      filter { post.isPublic is true or post.author is @auth }
      pageable
    }

    create endpoint {
      action {
        create {
          set author @auth
          set isVerified false
        }
      }
    }

    get endpoint {
      authorize { post.isPublic is true or post.author is @auth }
    }

    update endpoint {
      authorize { post.author is @auth }
    }

    delete endpoint {
      authorize { post.author is @auth }
    }

    entrypoint Comment as comment {
      authorize { post.isPublic is true or post.author is @auth }
    
      list endpoint { pageable }

      create endpoint {
        action {
          create {
            set author @auth
          }
        }
      }

      update endpoint {
        authorize { comment.author is @auth }
      }

      delete endpoint {
        authorize { comment.author is @auth }
      }
    }
  }
}
```

Keep in mind that this is an early version of the syntax, and we plan to reduce the amount of boilerplate even further.

## Current status

Gaudi is currently in beta. It's just about ready to be used to build applications which interface through REST API endpoints.

## Roadmap

TODO show roadmap here
