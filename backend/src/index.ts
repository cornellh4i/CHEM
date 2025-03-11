import express from "express";
import cors from "cors";
import wss from "./utils/websocket";
import contributorsRouter from "./routes/contributors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// Start Express server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});

server.on("error", (error) => {
  console.error("❌ Server failed to start due to error:", error);
});

wss.on("connection", (ws) => {
  ws.on("error", console.error);
  ws.on("message", (data) => {
    console.log("Received:", data);
    ws.send("Server received your message!");
  });

  ws.send("Connected to WebSocket server");
});
