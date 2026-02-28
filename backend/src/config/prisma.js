import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

function getPrismaClient() {
  if (!globalForPrisma.__prismaClient) {
    globalForPrisma.__prismaClient = createPrismaClient();
  }

  return globalForPrisma.__prismaClient;
}

export const prisma = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getPrismaClient();
      const value = client[prop];
      return typeof value === 'function' ? value.bind(client) : value;
    },
  },
);