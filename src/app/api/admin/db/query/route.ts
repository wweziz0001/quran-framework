import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Allowed SQL operations (read-only for safety)
const ALLOWED_OPERATIONS = ['SELECT', 'PRAGMA', 'EXPLAIN'];
const DANGEROUS_KEYWORDS = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE', 'INSERT', 'UPDATE', 'GRANT', 'REVOKE'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'الاستعلام مطلوب'
      }, { status: 400 });
    }
    
    // Normalize query for checking
    const normalizedQuery = query.trim().toUpperCase();
    
    // Check for dangerous keywords
    for (const keyword of DANGEROUS_KEYWORDS) {
      if (normalizedQuery.includes(keyword)) {
        return NextResponse.json({
          success: false,
          error: `عملية ${keyword} غير مسموح بها لأسباب أمنية`
        }, { status: 403 });
      }
    }
    
    // Check if operation is allowed
    const isAllowed = ALLOWED_OPERATIONS.some(op => normalizedQuery.startsWith(op));
    if (!isAllowed) {
      return NextResponse.json({
        success: false,
        error: 'فقط عمليات SELECT, PRAGMA, EXPLAIN مسموح بها'
      }, { status: 403 });
    }
    
    const startTime = performance.now();
    
    // Execute query
    const rows = await db.$queryRawUnsafe(query) as any[];
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // Extract column names from the first row
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    
    // Convert BigInt to Number for JSON serialization
    const serializedRows = rows.map(row => {
      const serialized: any = {};
      for (const key of Object.keys(row)) {
        const value = row[key];
        if (typeof value === 'bigint') {
          serialized[key] = Number(value);
        } else if (value instanceof Date) {
          serialized[key] = value.toISOString();
        } else {
          serialized[key] = value;
        }
      }
      return serialized;
    });
    
    return NextResponse.json({
      success: true,
      data: {
        columns,
        rows: serializedRows,
        executionTime,
        rowCount: serializedRows.length
      }
    });
  } catch (error: any) {
    console.error('SQL Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'خطأ في تنفيذ الاستعلام'
    }, { status: 500 });
  }
}
