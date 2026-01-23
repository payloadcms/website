import type { NextRequest, NextResponse } from 'next/server'
export declare function GET(request: NextRequest): Promise<
  | NextResponse<{
      activeUsers: number
      chartData: {
        date: string
        users: number
      }[]
      eventCount: number
      keyEvents: number
      period: string
      topPages: {
        page: string
        views: number
      }[]
      totalPageViews: number
      totalUsers: number
    }>
  | NextResponse<{
      error: string
      message: string
    }>
>
//# sourceMappingURL=route.d.ts.map
