import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Always create new PrismaClient to ensure latest schema
// In production, this would be optimized
export const db = new PrismaClient({
  log: ['query'],
})

// Export PrismaClient for direct use
export { PrismaClient }