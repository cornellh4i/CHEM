// jest.setup.ts
const nodeFetch = require('node-fetch');

if (!(globalThis as any).fetch) (globalThis as any).fetch = nodeFetch;
if (!(globalThis as any).Response) (globalThis as any).Response = nodeFetch.Response;
if (!(globalThis as any).Headers) (globalThis as any).Headers = nodeFetch.Headers;
if (!(globalThis as any).Request) (globalThis as any).Request = nodeFetch.Request;
