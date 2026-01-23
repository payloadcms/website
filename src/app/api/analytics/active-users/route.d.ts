import type { NextRequest, NextResponse } from 'next/server'
export declare function GET(request: NextRequest): Promise<
  | NextResponse<{
      error: string
      message: string
    }>
  | NextResponse<{
      locations: {
        activeUsers: number
        country: string
      }[]
      timestamp: string
      totalActiveUsers: number
    }>
>
//# sourceMappingURL=route.d.ts.map
