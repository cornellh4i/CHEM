import express from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import userRouter from "../routes/users";
import contributorRouter from "../routes/contributors";
import organizationRouter from "../routes/organizations";
import swaggerFile from "../../api-spec.json";

const app = express();

// Swagger endpoint
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));

// Middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Subrouters for our main router
app.use("/users", userRouter);
app.use("/contributors", contributorRouter);
app.use("/organizations", organizationRouter);

// Root route
// #swagger.ignore = true
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" }).status(200);
});

// Default route for undefined endpoints
// #swagger.ignore = true
app.get("*", (req, res) => {
  res
    .status(404)
    .json({ error: "You have reached a route not defined in this API" });
});

export default app;
