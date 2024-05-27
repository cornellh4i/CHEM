# Frontend

The frontend is a Next.js web app bundling TypeScript, ESLint, and Tailwind CSS. Basic components are built with Flowbite, acting as the foundation for a custom design system entirely controlled with Tailwind.

## Getting started

To start, create `.env.local` from the provided `.env.template` file.

- `yarn dev` starts the app at `localhost:3000`
- `yarn build` compiles the app
- `yarn start` starts the compiled app

## Manual setup

If you are interested in recreating the project template from scratch, the commands are shown below, assuming `node v20` is installed:

1.  Run `npx create-next-app@latest` and push to a new repository.

2.  Install yarn:

    ```bash
    # Enable corepack if not already enabled
    corepack enable

    # Install latest version of yarn
    yarn set version stable
    ```

3.  Add `.yarn` to your `.gitignore` file.

4.  Create `.yarnrc.yml` and paste in the following to disable plug-and-play mode:

    ```yaml
    nodeLinker: node-modules
    ```

5.  Install dependencies:

    ```bash
    # flowbite, flowbite-react       : Component library
    # react-hook-form                : Form handling
    # firebase, react-firebase-hooks : Firebase authentication
    # @tanstack/react-query          : Data fetching and updating
    yarn add \
        flowbite \
        flowbite-react \
        react-hook-form \
        firebase \
        react-firebase-hooks \
        @tanstack/react-query

    # prettier : Code formatting with Tailwind support
    yarn add --dev \
        prettier \
        prettier-plugin-classnames \
        prettier-plugin-jsdoc \
        prettier-plugin-merge \
        prettier-plugin-tailwindcss
    ```

6.  Create `.prettierrc` and paste in the following.

    ```bash
    {
      "trailingComma": "es5",
      "plugins": [
        "prettier-plugin-classnames",
        "prettier-plugin-jsdoc",
        "prettier-plugin-tailwindcss",
        "prettier-plugin-merge"
      ],
      "endingPosition": "absolute-with-indent"
    }
    ```

7.  Run `npx prettier --write .` to standardize formatting and indentation across all files.

8.  Change `tailwind.config.ts` to add Flowbite as a plugin, include the JS files from Flowbite React, and enable dark mode based on device setting:

    ```jsx
    import type { Config } from "tailwindcss";

    const config: Config = {
      content: [
        "./node_modules/flowbite-react/lib/**/*.js",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
      ],
      theme: {
        extend: {
          backgroundImage: {
            "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            "gradient-conic":
              "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
          },
        },
      },
      plugins: [require("flowbite/plugin")],
      darkMode: "media",
    };
    export default config;
    ```

9.  Change `.eslintrc.json` so that we can use `<img>` tags:

    ```jsx
    {
      "extends": "next/core-web-vitals",
      "rules": {
        "@next/next/no-img-element": "off"
      }
    }
    ```

10. Update the root `layout.tsx` file to incorporate TanStack Query:

    ```jsx
    "use client"

    import { Inter } from "next/font/google";
    import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
    import "./globals.css";

    const inter = Inter({ subsets: ["latin"] });

    /** Tanstack query client */
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
    });

    export default function RootLayout({
      children,
    }: Readonly<{
      children: React.ReactNode;
    }>) {
      return (
        <html lang="en">
          <QueryClientProvider client={queryClient}>
            <body className={inter.className}>{children}</body>
          </QueryClientProvider>
        </html>
      );
    }
    ```

11. Congratulations! You now have a fully functioning Next.js app. Beyond this point, this template provides pages, components, and utils specified below.

## Folder structure

Components are organized according to [atomic design](https://atomicdesign.bradfrost.com/chapter-2/) principles. In short, components are organized into the following categories:

- **Atoms** are generic and reusable components that cannot be broken down further (Button, Input, Checkbox)
- **Molecules** are generic and reusable components that are complex and act as containers for other content (Table, Modal, Card)
- **Organisms** are non-generic components that handle specific business logic (SignupForm, LoginForm)
- **Templates** are page layouts with a focus on handling responsive design (DefaultTemplate, CenterTemplate)

## Authentication

The template provides a complete end-to-end solution for Firebase authentication, covering the vast majority of the authentication pipeline. This includes email login, signup, forgot/reset password, and email verification.

## Hooks

Hooks are used wherever possible for cleaner state management. `tanstack-query` and `react-firebase-hooks` are used to provide hooks for API calls and common Firebase functions, but a few custom hooks in `@/utils/hooks.ts` are also provided. One example where hooks can simplify code is when we are implementing error display. Imagine we want to trigger a notification every time our application encounters an error. One option is to continuously render the error message:

```ts
if (error) {
  return <p>{error.message}</p>;
}
```

However, some UI components are incompatible with this approach. For example, we may want a toast notification that can be user-dismissed. In that case, we need the following:

```ts
/** Toast visibility state */
const [open, setOpen] = useState(false);

// Show errors
useEffect(() => {
  if (error) {
    setOpen(true);
  }
}, [error]);

return (
  <Toast open={open} onClose={() => setOpen(false)}>
    {error?.message}
  </Toast>;
)
```

With hooks, this can be simplified to the following:

```ts
/** Toast visibility hooks */
const { open, closeToast } = useToast(error);

return (
  <Toast open={open} onClose={closeToast}>
    {error?.message}
  </Toast>
);
```

## API

The frontend comes with an opinionated `fetch` wrapper for API calls to the backend with authentication and error handling built in, shown below:

```ts
// fetch
import auth from "@/utils/firebase";
import { SERVER_URL } from "@/utils/constants";

try {
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(`${SERVER_URL}/users?email=${user.email}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (response.ok) {
    console.log(data);
  } else {
    throw new Error(data.error);
  }
} catch (error) {
  console.error(error);
}
```

```ts
// fetch wrapper
import api from "@/utils/api";

try {
  const response = await api.get(`/users?email=${user.email}`);
  console.log(response.data);
} catch (error) {
  console.error(error);
}
```

## Deploy

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js. Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
