import world from './world';

export default async () => {
  world.servers = [];
  world.predicates = [];
  world.responses = [];
  world.imposterPort = undefined;
};
