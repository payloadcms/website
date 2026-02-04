export type RoadmapPriority = 'P0' | 'P1' | 'P2' | 'TBD'

export interface RoadmapItem {
  title: string
  description: string
  url: string
  number: number
  priority: RoadmapPriority
  commentCount: number
  upvoteCount: number
  createdAt: string
}

export interface RoadmapCardProps {
  item: RoadmapItem
  showPriorityBadge?: boolean
}

export interface RoadmapBlockProps {
  roadmapData: {
    P0: RoadmapItem[]
    P1: RoadmapItem[]
    P2: RoadmapItem[]
    TBD: RoadmapItem[]
  }
}
