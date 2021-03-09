import { Given } from '@cucumber/cucumber';
import http from 'http';
import world from '../world/world';

Given('a following schema definition exists at the {string} URL:', async (schemaLocation, schema) => {
  const url = new URL(schemaLocation);
  const port = url.port
    ? parseInt(url.port, 10)
    : 80;
  const server = http.createServer((request, response) => {
    if (request.url === url.pathname) {
      response.writeHead(200);
      response.end(schema);
    } else {
      response.writeHead(401);
    }
  });
  await server.listen(port, url.hostname);
  world.closeableServers[port] = server;
});
