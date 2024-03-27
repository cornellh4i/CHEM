# web-template
An opinionated web application project template.

## Backend
```bash
# Init new project
yarn init
npx gitignore node

# Set up Prisma and TypeScript
yarn add --dev prisma typescript ts-node @types/node
yarn add @prisma/client
npx tsc --init
npx prisma init

# Set up Express, CORS, WebSocket, Swagger, nodemon, dotenv, Jest
yarn add --dev @types/express @types/cors @types/ws @types/swagger-ui-express nodemon jest
yarn add express cors ws swagger-autogen swagger-ui-expres dotenv
```

The backend is a Node.js and Express server with a PostgreSQL database managed by [Prisma ORM](https://www.prisma.io/). A WebSocket server is also implemented since WebSockets are needed for of automatic data fetching. A `.env` file should be created from the `.env.template` file. Swagger is used to autogenerate API documentation, and Jest is used for testing.

The project roughly follows the Model-View-Controller pattern:
- **Controllers** are functions that directly interact with the data model, such as `getUsers`
- **Middleware** are functions that sit between routes and controllers, handling tasks such as route authentication, logging, and more
- **Routes** (views) are the endpoints that users directly interact with, such as `GET /api/users/:userid`

## Frontend
```bash
# Init new Next.js project
npx create-next-app@latest

# Install packages
yarn add flowbite react-hook-form firebase react-firebase-hooks @tanstack/react-query
```

The frontend is a Next.js web app bundling TypeScript, ESLint, and Tailwind CSS. Basic components are built with Flowbite, acting as the foundation for a custom design system entirely controlled with Tailwind. A `.env.local` file should be created from the `.env.template` file.

Components are organized according to [atomic design](https://atomicdesign.bradfrost.com/chapter-2/) principles. In short, components are organized into the following categories:
- **Atoms** are generic and reusable components that cannot be broken down further (Button, Input, Checkbox)
- **Molecules** are generic and reusable components that are complex and act as containers for other content (Table, Modal, Card)
- **Organisms** are non-generic components that handle specific business logic (SignupForm, LoginForm)
- **Templates** are page layouts with a focus on handling responsive design (DefaultTemplate, CenterTemplate)

Additional dependencies include:
- `react-hook-form` for simple form handling
- `firebase` and `react-firebase-hooks` for Firebase authentication
- `@tanstack/react-query` for easier data fetching and updating

The frontend comes with an opinionated `fetch` wrapper for API calls to the backend with authentication built in, shown below:
```ts
// fetch
import auth from "@/utils/firebase";
import { SERVER_URL } from "@/utils/constants";

const token = await auth.currentUser?.getIdToken();
const response = await fetch(`${SERVER_URL}/users?email=${user.email}`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const data = await response.json();
console.log(data)


// fetch wrapper
import api from "@/utils/api";

const response = await api.get(`/users?email=${user.email}`);
console.log(response.data)
```

## Images
![image](https://github.com/jasozh/web-template/assets/48730262/bebacbe8-8537-4114-b611-c91d5a2ed954)
