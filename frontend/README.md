# Frontend

The frontend is a Next.js web app bundling TypeScript, ESLint, and Tailwind CSS. Basic components are built with Flowbite, acting as the foundation for a custom design system entirely controlled with Tailwind. A `.env.local` file should be created from the `.env.template` file. Additional dependencies include:

- `react-hook-form` for simple form handling
- `firebase` and `react-firebase-hooks` for Firebase authentication
- `@tanstack/react-query` for easier data fetching and updating

## Getting started

- `yarn dev` starts the app at `localhost:3000`
- `yarn build` compiles the app
- `yarn start` starts the compiled app

## Manual setup

If you are interested in recreating the project template from scratch, the commands are shown below:

```bash
# Init new Next.js project
npx create-next-app@latest

# Install packages
yarn add flowbite react-hook-form firebase react-firebase-hooks @tanstack/react-query
```

## Folder structure

Components are organized according to [atomic design](https://atomicdesign.bradfrost.com/chapter-2/) principles. In short, components are organized into the following categories:

- **Atoms** are generic and reusable components that cannot be broken down further (Button, Input, Checkbox)
- **Molecules** are generic and reusable components that are complex and act as containers for other content (Table, Modal, Card)
- **Organisms** are non-generic components that handle specific business logic (SignupForm, LoginForm)
- **Templates** are page layouts with a focus on handling responsive design (DefaultTemplate, CenterTemplate)

## API

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
console.log(data);

// fetch wrapper
import api from "@/utils/api";

const response = await api.get(`/users?email=${user.email}`);
console.log(response.data);
```

## Deploy

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js. Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
