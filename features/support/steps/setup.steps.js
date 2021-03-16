import { After, AfterAll, BeforeAll } from '@cucumber/cucumber';
import { writeFileSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import fetch from 'node-fetch';
import { create as createMountebank } from 'mountebank';

import logger from '../logger';
import resetWorld from '../world/resetWorld';
import world from '../world/world';

BeforeAll(async () => {
  const protocol = {
    graphql: {
      createCommand: 'node dist/index.js',
    },
  };

  const protocolFilePath = `${tmpdir()}${path.sep}protocols.json`;
  writeFileSync(protocolFilePath, JSON.stringify(protocol), 'UTF-8');

  world.mountebankServer = await createMountebank({
    port: world.mountebankPort,
    protofile: protocolFilePath,
    ipWhitelist: ['*'],
  });
});

AfterAll(async () => {
  await world.mountebankServer.close(() => {
    logger('Mountebank stopped');
  });
  world.mountebankServer = undefined;
  await resetWorld();
});

After(async () => {
  const stopServerPromises = world.servers
    .filter((server) => !!server)
    .map((server) => {
      if (server.close) {
        return server.close();
      }
      return server.stop();
    });
  await Promise.all(stopServerPromises);
  await fetch(`http://localhost:${world.mountebankPort}/imposters`, { method: 'delete' });
  await resetWorld();
});
