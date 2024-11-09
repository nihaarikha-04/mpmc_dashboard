// Import the required modules
const { SerialPort } = require("serialport");
const WebSocket = require("ws");
//const Readline = require("@serialport/parser-readline");

// Initialize the serial port (make sure to replace "COM7" with the correct port)
const port = new SerialPort({
  path: "COM7",
  baudRate: 9600,
});

// Initialize the WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log("WebSocket server is running on ws://localhost:8080");

// When the WebSocket server receives a connection
wss.on("connection", (ws) => {
  //console.log("Client connected to WebSocket");

  // Handle messages from WebSocket clients, if needed
  ws.on("message", (message) => {
    console.log("Received from client:", message);
    // You could send data to the serial port here if needed
  });

  // Handle WebSocket disconnections
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Set delay in milliseconds (e.g., 1000 ms = 1 second)
const delay = 1000;

// Buffer for storing incoming data temporarily
let bufferedData = "";

port.on("data", (data) => {
  bufferedData += data.toString(); // Accumulate data if it comes in chunks
});

setInterval(() => {
  if (bufferedData) {
    console.log("Data from Serial Port:", bufferedData);

    // Broadcast the buffered data to all connected WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(bufferedData);
      }
    });

    // Clear the buffer after broadcasting
    bufferedData = "";
  }
}, delay);

// Error handling for the serial port
port.on("error", (err) => {
  console.error("Serial Port Error:", err.message);
});
