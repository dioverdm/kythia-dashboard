'use server';

import { headers } from 'next/headers';
import { prisma } from '@/libs/prisma';

export async function trackVisitor() {
  try {
    // Intenta crear la tabla si no existe (solo para desarrollo)
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS visitors (
        id VARCHAR(255) PRIMARY KEY,
        ip VARCHAR(255) UNIQUE NOT NULL,
        visits INT DEFAULT 1,
        lastVisit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
    
    // Upsert visitor
    await prisma.visitor.upsert({
      where: { ip },
      update: {
        visits: { increment: 1 },
        lastVisit: new Date(),
      },
      create: {
        ip,
        visits: 1,
      },
    });
    
    // Get stats
    const totalVisitors = await prisma.visitor.count();
    
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const todayVisitors = await prisma.visitor.count({
      where: {
        lastVisit: {
          gte: startOfDay,
        },
      },
    });
    
    return {
      totalVisitors,
      todayVisitors,
      success: true,
    };
  } catch (error) {
    console.error('Error tracking visitor:', error);
    
    // SI TODO FALLA, retorna valores dummy
    return {
      totalVisitors: 1234,
      todayVisitors: 42,
      success: false,
      error: 'Usando datos de prueba',
    };
  }
}