import { WebSocket } from "ws";
import wss from "./websocket";

/**
 * Sends a message from the WebSocket server to all connected clients
 *
 * @param resource - The API resource that has been updated; if a user with uuid
 *   `1234` was updated, the resource would be `/users/1234`
 * @returns Void
 */
export const notify = (resource: string): void => {
  const data = {
    resource: resource,
    message: "The resource has been updated!",
  };
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};
