# How "todo" Gaudi

## Intro

You've probably heard of the famous "TodoMVC" application. It was originally written by Addy Osmani of Google, not as a specific application but more as a project that provides a variety of implementations of a simple to-do list application. It is used to showcase and compare different JavaScript frameworks, technologies and even performance benchmarks. Over time, it's gotten so famous that it even got its own [website](https://todomvc.com/) and an [application specification](https://github.com/tastejs/todomvc/blob/master/app-spec.md).

Since it is used to showcase frameworks capabilities, let's use it to showcase the power and ease of programming backend APIs in Gaudi. "TodoMVC" is simple, well known, publicly specified and needs no additional introductions. Moreover, it already has a prepared [template](https://github.com/tastejs/todomvc-app-template) and [styles](https://github.com/tastejs/todomvc-app-css/) so we can focus on implementing application logic and still have our application look nice. Win, win. :)

There are many existing "TodoMVC" example applications available at [todomvc.com](https://todomvc.com/) but they're all pretty outdated and unmaintained so we'll implement our own application using [React](htps://react.dev) and [Typescript](https://www.typescriptlang.org/)

## Project setup

Since we will need to implement both backend and frontend, for the simplicity of the setup, we will separate them into different folders, unexpectedly named `backend`/`frontend`, and build them independently. Although both of them use NPM for package management, we will use root project's `package.json` only for some common utils that operate on both folders.

Gaudi requires NodeJS and PostgreSQL to be installed on you computer so make sure you have them setup.

For starters, we need to create a project root folder e.g. `todomvc-gaudi` where we will initialize backend and frontend projects.

## Gaudi backend

### Initialization

Initializing Gaudi project is as simple as creating a new NPM project and adding [Gaudi CLI](https://www.npmjs.com/package/gaudi) as a dependency, but we will use [create-gaudi-app](https://www.npmjs.com/package/create-gaudi-app) interactive CLI tool as it sets up other development details as well.

In the project's root folder let's run `create-gaudi-app` which will create `backend` folder and initialize project structure. Command will prompt you to select a template, select `Gaudi backend project` and follow instruction on the screen.

```sh
npx create-gaudi-app backend
```

### Model

Model is simple and consists only of `Todo`s. Open Gaudi file `src/gaudi/demo.gaudi` and this snippet.

```js
model Todo {
  field title { type string }
  field completed { type boolean, default false }
}
```

We could expand this model with other fields, like created timestamp, description, todo groups, ... but let's keep it simple and use only fields necessary for this demo.

### API

Now that we have our model we also need an API that will expose our data to clients. Todo MVC needs the following API endpoints:

- list all todos
- create new todo
- update existing todo
- delete todo

This is how it looks like in Gaudi

```js
api {
  entrypoint Todo {
    // list all todos
    list endpoint { order by { id desc } }
    // create new todo
    create endpoint {}
    // update existing todo
    update endpoint {}
    // delete todo
    delete endpoint {}
  }
}
```

And that's it! Really. :) We have created first 4 REST CRUD endpoints.

We can try our API by auto-generating a [swagger](https://swagger.io/) instance. Simply add this block to you Gaudi file

```js
generator apidocs {}
```

Start your dev server, if you haven't already, with command `npm run dev`, and open `http://localhost:3001/api-docs/` in your browser. You should see a swagger page with 4 endpoints and you can interact with them.

In `backend/.env` file you can tweak some server parameters. You can probably leave most of them as is but make sure to adjust `GAUDI_DATABASE_URL` to your DB setup. For more details about Gaudi project structure and commands see `README.md` in `backend` folder or consult [Gaudi docs](https://docs.gaudi.tech/).

### Data populator

We've successfully create our database and API but the database is completely empty. Of course, we could manually create initial data but with Gaudi we can do better. :) We can create a "populator" that can do that for us. Add the following snippet to your Gaudi file.

```js
// populator named "Dev"
populator Dev {
  // populate "Todo" model
  populate Todo as todo {
      // we want 3 records
      repeat as iter 3

      // title (e.g. "Todo #1")
      set title "Todo #" + stringify(iter.current)
      // initially not completed
      set completed false
  }
}
```

To populate database we need to run the following command

```sh
# run "Dev" populator
npm gaudi db populate -p Dev
```

You can now go to [swagger](http://localhost:3001/api-docs/#/default/get_api_todo), try calling `GET /api/todo` endpoint and it should return 3 todo records.

## React frontend

### Initialization

To initialize frontend project we will use `create-react-app` script. Of course, if you want, you can use any other initializer tool (e.g. `vite`) but `create-react-app` is simple and focused on the application itself which makes it a good choice for this demo projects.

We always try to use `TypeScript` in our projects but feel free to skip it if you feel more comfortable with vanilla JS.

```sh
npx create-react-app my-app --template typescript
```

### Application

As mentioned before, Todo MVC project already has prepared [template](https://github.com/tastejs/todomvc-app-template) and [styles](https://github.com/tastejs/todomvc-app-css/) which we will use in this demo to get the same look and feel as other implementations.

Since this is a React application, we will divide our markup to several components to make application more readable and maintainable. We will create the following components:

- `App.tsx` - main component which composes other components, proxies events API calls and serves as a data container
- `Header.tsx` - titlebar, editor for new todos
- `List.tsx` - display list of todos, handles todo editing controls
- `Footer.tsx` - handles filtering and cleaning controls
- `Editor.tsx` - convenient wrapper around input control

`App.tsx` component will look something like this

```tsx
function App() {
  return (
    <>
      <section>
        <Header />

        <List />

        <Footer />
      </section>
    </>
  );
}
```

### API

All we're left to do is to connect the frontend with the backend. We could, of course, use old-fashioned `fetch` to call our API endpoint URLs but that wouldn't be _"The Gaudi Way"_. :) Gaudi can automatically create JS/TS library that exactly matches our API and gives us code completion and type-safety for request, response and errors. We simply need to tell Gaudi to generate and the location where where to store the file.

Add this snippet to your Gaudi file

```js
generator client {
  // we want a TS file
  target ts
  // output file to our frontend project so it can find it
  output "../frontend/src"
}
```

We could use our new library directly in our components but let's wrap it in more convenient `TodoApi.ts` function.

```ts
import { createClient } from "./api-client";

export const TodoApi = {
  // fetch a list of all todos from API
  async list() {
    // create API client
    const client = createClient({ rootPath: "http://localhost:3001" });

    // call API `list` method
    const resp = await client.api.todo.list();

    // handle error response
    if (resp.kind === "error") {
      throw new Error(
        `[API] Error fetching todo list. ${resp.error} (${resp.status})`
      );
    }

    // return successful response
    return resp.data;
  },

  // [...]
};
```

Now we can finally plug it in our `App.tsx`

```ts
import { TodoApi } from "./TodoApi";

// App component
function App() {
  // state for todos
  const [todos, setTodos] = useState<Todo[]>([]);

  // event callback that fetches todo list from API
  const fetchAll = useCallback(async () => {
    // call the API
    const data = await TodoApi.list();
    // store data to state
    setTodos(data);
  }, [setTodos]);

  // [...]
}
```

In a similar manner we can other API calls and connect them to our app.

## TIL

What have we learned today?

We can initialize Gaudi projects with one command using `create-gaudi-app`.

Gaudi provides an easy and intuitive syntax for modeling data structures and relationships. Gaudi also handles automatic database schema syncing and data population.

Based on the model we can expose only CRUD APIs that we actually need but also customize them when needed. We can automatically generate OpenAPI specification and a Swagger instance.

For easier integration with third-party clients, Gaudi can automatically generate JS/TS client library that exactly mirrors our API and provides complete type-safety.

This tutorial contains only short snippets of code to explain key points in this project. Entire project code is available [here](https://github.com/gauditech/gaudi/tree/main/packages/create-gaudi-app/template-todomvc-gaudi).
