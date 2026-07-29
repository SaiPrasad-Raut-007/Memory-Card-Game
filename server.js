import { WebSocketServer } from "ws";
const PORT = 3000;

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
  console.log("Connected Successfully")
  wss.on("message", (data) => {
    ws.send(`Hello ${data}`)
  })
})
