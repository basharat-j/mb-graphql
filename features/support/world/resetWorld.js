import world from './world';

export default async () => {
  world.stoppableServers = [];
  world.closeableServers = [];
  world.predicates = [];
  world.responses = [];
  world.imposterPort = undefined;
};
