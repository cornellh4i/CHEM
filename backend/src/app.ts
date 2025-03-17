import express from "express";

const app = express();
app.use(express.json());

// Import and use your routes here if needed, like:
// app.use('/organizations', organizationRoutes);
// app.use('/contributors', contributorRoutes);

export default app;
