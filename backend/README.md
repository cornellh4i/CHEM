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

If you are interested in recreating the project template from scratch, the commands are shown below:

```bash
# Create new Node.js project
yarn init
npx gitignore node
yarn add --dev typescript ts-node @types/node
npx tsc --init

# Install Prisma
yarn add --dev prisma
yarn add @prisma/client
npx prisma init

# Install dependencies
yarn add \
    express \                            # Express server
    cors \                               # Enable CORS
    ws \                                 # WebSocket server
    swagger-autogen swagger-ui-express \ # Swagger autogen and API docs
    dotenv                               # Load .env files
yarn add --dev \
    nodemon                              # Hot reload server in dev mode
    jest ts-jest                         # Test suite
    supertest                            # Make API calls in test suite
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

## Deploy

The server should be deployed as a Docker container.
