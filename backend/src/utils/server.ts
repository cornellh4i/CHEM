import express from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import userRouter from "../routes/users";
import spec from "../../api-spec.json";

const app = express();

// Swagger endpoint
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(spec));

// Middleware to allow cross-origin requests
app.use(cors());

// Subrouters for our main router
app.use("/users", userRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!").status(200);
});

// Default route for undefined endpoints
app.get("*", (req, res) => {
  res.send("You have reached a route not defined in this API");
});

export default app;
