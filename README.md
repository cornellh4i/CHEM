# web-template
An opinionated web application project template.

## Frontend

`npx create-next-app@latest`

The frontend is a Next.js web app bundling TypeScript, ESLint, and Tailwind CSS. Components are organized according to [atomic design](https://atomicdesign.bradfrost.com/chapter-2/) principles and basic components are built with Flowbite. Additional dependencies include:
- `react-hook-form` for simple form handling
- `firebase` and `react-firebase-hooks` for Firebase authentication

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

## Images
![image](https://github.com/jasozh/web-template/assets/48730262/bebacbe8-8537-4114-b611-c91d5a2ed954)
