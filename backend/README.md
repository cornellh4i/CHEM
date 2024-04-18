# Backend

The backend is a Node.js and Express server with a PostgreSQL database managed by [Prisma ORM](https://www.prisma.io/). A WebSocket server is also implemented since WebSockets are needed for of automatic data fetching. A `.env` file should be created from the `.env.template` file. Swagger is used to autogenerate API documentation, and Jest is used for testing.

## Getting started

- `yarn dev` starts the server in development mode with `nodemon` at `localhost:8000`
- `yarn build` compiles the server
- `yarn start` starts the server in production mode
- `yarn test` seeds the database and runs the Jest test suite
- `yarn setup` does a database migration based on the Prisma schema, seeds the database, and autogenerates the API documentation available at route `/api-docs`
- `yarn setup:ci` does the same actions as `yarn setup` except uses `prisma migrate deploy` instead of `prisma migrate dev`

## Manual setup

If you are interested in recreating the project template from scratch, the commands are shown below, assuming `node v20` is installed:

1. Install yarn:

   ```bash
   # Enable corepack if not already enabled
   corepack enable

   # Install latest version of yarn
   yarn set version stable
   ```

2. Create `.yarnrc.yml` and paste in the following to disable plug-and-play mode:

   ```yaml
   nodeLinker: node-modules
   ```

3. Create a new Node.js project:

   ```bash
   # Create new Node.js project
   npx gitignore node
   yarn init
   yarn add --dev typescript ts-node @types/node
   npx tsc --init
   ```

4. Install dependencies:

   ```bash
   # express                            : Express server
   # cors                               : Enable CORS
   # ws                                 : WebSocket server
   # swagger-autogen swagger-ui-express : Swagger autogen and API docs
   # dotenv                             : Load .env files
   yarn add \
       express \
       cors \
       ws \
       swagger-autogen swagger-ui-express \
       dotenv

   # nodemon      : Hot reload server in dev mode
   # jest ts-jest : Test suite
   # supertest    : Make API calls in test suite
   # prettier     : Code formatting
   yarn add --dev \
       nodemon \
       jest ts-jest \
       supertest \
       prettier \
       prettier-plugin-jsdoc \
       @types/express @types/cors @types/ws @types/swagger-ui-express @types/jest @types/supertest
   ```

## Folder structure

The project roughly follows the Model-View-Controller pattern:

- **Controllers** are functions that directly interact with the data model, such as `getUsers`
- **Middleware** are functions that sit between routes and controllers, handling tasks such as route authentication, logging, and more
- **Routes** (views) are the endpoints that users directly interact with, such as `GET /api/users/:userid`

## API

API endpoints are defined according to [RESTful best practices](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design) where each endpoint corresponds to a specific resource. For example:

| Method | Endpoint       | Meaning                                                          |
| ------ | -------------- | ---------------------------------------------------------------- |
| GET    | /users         | Get all users in the database                                    |
| GET    | /users/:userid | Get a user with id `userid`                                      |
| PUT    | /users/:userid | Completely replace the user object for the user with id `userid` |
| PATCH  | /users/:userid | Partially modify the user object for the user with id `userid`   |
| POST   | /users         | Create a new user                                                |

Filtering, sorting, and pagination should also follow [RESTful best practices](https://www.moesif.com/blog/technical/api-design/REST-API-Design-Filtering-Sorting-and-Pagination/). In particular, cursor-based pagination should be used for large datasets. Syntax is shown below:

```bash
# Filtering
GET /api/users?firstName="Bobby"&lastName="Fischer"
GET /api/items?price=gte:10&price=lte:100

# Sorting
GET /api/events?sort=location:desc

# Pagination
GET /api/users?limit=100&after=xjf48992

# Get the first 100 users with name "Bobby Fischer" sorted by email in ascending order
GET /api/users?firstName="Bobby"&lastName="Fischer"&sort=email:asc&limit=100&after=xjf48992

# Get the first 20 upcoming events sorted by location in descending order
GET /api/events/upcoming=true?sort=location:desc&limit=20&after=xjf48992
```

## Swagger

`backend/src` also contains swagger, which is currently configured to automically generate documentation for the backend. To view the documentation, run `yarn swagger` and then navigate to `localhost:8000/api-docs` in your browser. This step is important becuase it will auto-generate the swagger.json file that is used to generate the documentation.

In order to structure our swagger documentation properly, ensure that you add the `#swagger.tags = ['name of section']` comment to the top of each function in the controller file. This will ensure that the swagger documentation is properly organized. For example, if you have a controller file that contains all of the routes for the `users` entity, you should add the following comment to the top of each method:

```js
// #swagger.tags = ['Users']
```

Swagger is useful for us because we can then import the swagger.json file into Postman and use it to generate a collection of requests that we can use to test our backend. To do this, simply import the api-docs.json file into Postman and it will automatically generate a collection of requests for you.

## Prisma

This backend makes use of Prisma, a database toolkit that allows us to easily create and manage our database schema. To learn more about Prisma, check out their <a href="https://www.prisma.io/docs/">documentation</a>. The documentation is really well written and easy to follow.

The major components we are using are:

- Prisma Client -- a type-safe database client that allows us to easily query our database
- Prisma Migrate -- a database migration tool that allows us to easily create and manage our database schema
- Prisma Studio -- a GUI that allows us to easily view and edit our database schema

The Prisma schema is located in `backend/prisma/schema.prisma`. This file contains all of the models and relationships between them. To learn more about the Prisma schema, check out <a href="https://www.prisma.io/docs/concepts/components/prisma-schema">this page</a> on the Prisma website.

To create a new migration, run `npx prisma migrate dev --name <name of migration>`. This will create a new migration file in `backend/prisma/migrations`. To apply the migration to your database, run `yarn prisma migrate deploy`. To view the current state of the database, run `yarn prisma studio`.

`backend/prisma/seed.ts` contains a script that will seed the database with some dummy data. To run this script, run `yarn prisma db seed`.

## Deploy

This backend can also be easily dockerized. Once you've created your env file, simply run `docker compose up -d` or `docker compose up` to start up the application (make sure the docker daemon is running).

If this fails, try running `docker system prune`. The application should begin running at port 8000 on your local machine.
