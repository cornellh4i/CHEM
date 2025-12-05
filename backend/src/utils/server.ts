import express from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import userRouter from "../routes/users";
import contributorRouter from "../routes/contributors";
import organizationRouter from "../routes/organizations";
import transactionRouter from "../routes/transactions";
import swaggerFile from "../../api-spec.json";
import fundRouter from "../routes/funds";
import authRouter from "../routes/auth";

const app = express();

// Swagger endpoint
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));

// Middleware to allow cross-origin requests
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Subrouters for our main router
app.use("/users", userRouter);
app.use("/contributors", contributorRouter);
app.use("/organizations", organizationRouter);
app.use("/transactions", transactionRouter);
app.use("/funds", fundRouter);
app.use("/auth", authRouter);

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
