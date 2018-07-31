// Get dependencies
import express from "express";
import path from "path";
import http from "http";
import bodyParser from "body-parser";

// Logging
var winston = require("./server/config/winston");
var morgan = require("morgan");

const cors = require("cors");
// Get our API routes
const api = require("./server/routes/api");

const app = express();
app.use(cors());

app.use(morgan("combined", { stream: winston.stream }));

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, "dist")));

// Set our api routes
app.use("/api", api);

// Catch all other routes and return the index file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || "3000";
app.set("port", port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
