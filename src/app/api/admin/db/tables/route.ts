import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Get all table names from the database
    const tablesResult = await db.$queryRaw`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%'
      ORDER BY name
    ` as { name: string }[];
    
    const tables = [];
    
    for (const table of tablesResult) {
      try {
        // Get row count for each table
        const countResult = await db.$queryRawUnsafe(
          `SELECT COUNT(*) as count FROM "${table.name}"`
        ) as { count: bigint }[];
        
        tables.push({
          name: table.name,
          rowCount: Number(countResult[0]?.count || 0)
        });
      } catch {
        tables.push({
          name: table.name,
          rowCount: 0
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      data: tables
    });
  } catch (error: any) {
    console.error('Error fetching tables:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
