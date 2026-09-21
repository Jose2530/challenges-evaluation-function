#!/usr/bin/env node

import debugLib from "debug";
import config from "../config";
import * as http from "http";
import app from "../app";

const debug = debugLib("bdb:server");

const port = normalizePort(config.PORT);
app.set("port", port);

const www = http.createServer(app);

www.listen(port);
www.on("error", onError);
www.on("listening", onListening);

function normalizePort(val: string) {
  const nPort = parseInt(val, 10);

  if (isNaN(nPort)) {
    return val;
  }

  if (nPort >= 0) {
    return nPort;
  }

  return false;
}

function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case "EACCES":
      debug(`${bind}  requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      debug(`${bind}  is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const address = www.address();
  const bind =
    typeof address === "string"
      ? `pipe ${address}`
      : `port ${(address as any).port}`;
  debug(`Listening on ${bind}`);
}
