import type { NextRequest, NextResponse } from 'next/server'
export declare function GET(request: NextRequest): Promise<
  | NextResponse<{
      channels: {
        channel: string
        sessions: number
      }[]
      period: string
      timestamp: string
      totalSessions: number
    }>
  | NextResponse<{
      error: string
      message: string
    }>
>
//# sourceMappingURL=route.d.ts.map
