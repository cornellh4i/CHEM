# web-template
An opinionated web application project template.

## Frontend

`npx create-next-app@latest`

The frontend is a Next.js web app bundling TypeScript, ESLint, and Tailwind CSS. Basic components are built with Flowbite, acting as the foundation for a custom design system entirely controlled with Tailwind.

Components are organized according to [atomic design](https://atomicdesign.bradfrost.com/chapter-2/) principles. In short, components are organized into the following categories:
- **Atoms** are generic and reusable components that cannot be broken down further (Button, Input, Checkbox)
- **Molecules** are generic and reusable components that are complex and act as containers for other content (Table, Modal, Card)
- **Organisms** are non-generic components that handle specific business logic (SignupForm, LoginForm)
- **Templates** are page layouts with a focus on handling responsive design (DefaultTemplate, CenterTemplate)

Additional dependencies include:
- `react-hook-form` for simple form handling
- `firebase` and `react-firebase-hooks` for Firebase authentication
- `@tanstack/react-query` for easier data fetching and updating

A `.env.local` file should be created with the following format:
```
NEXT_PUBLIC_FIREBASE_API_KEY = ""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = ""
NEXT_PUBLIC_FIREBASE_PROJECT_ID = ""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = ""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = ""
NEXT_PUBLIC_FIREBASE_APP_ID = ""
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = ""
NEXT_PUBLIC_BASE_URL_SERVER = "http://localhost:8000"
NEXT_PUBLIC_BASE_URL_CLIENT = "http://localhost:3000"
```

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
