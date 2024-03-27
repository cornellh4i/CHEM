import { PrismaClient } from "@prisma/client";
import { WebSocketServer } from "ws";
import app from "./server";

// Express server
const server = app.listen(process.env.PORT || 8000);

server.on("listening", () => {
  console.log("✅ Server is up and running at http://localhost:8000");
});

server.on("error", (error) => {
  console.log("❌ Server failed to start due to error: %s", error);
});

// WebSocket server
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  // Error handling
  ws.on("error", console.error);

  // What happens when the server receives data
  ws.on("message", (data) => {
    console.log("received: %s", data);
    ws.send("server received your message!");
  });

  // Default message to send when connected
  ws.send("something");
});
