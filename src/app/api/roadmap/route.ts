import { fetchRoadmap } from '../../_data/fetchRoadmap'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  try {
    const roadmapData = await fetchRoadmap()
    return NextResponse.json(roadmapData)
  } catch (error) {
    console.error('Error in roadmap API route:', error)
    return NextResponse.json({ error: 'Failed to fetch roadmap data' }, { status: 500 })
  }
}
