import type { CollectionConfig } from 'payload'

export const GeneratedSites: CollectionConfig = {
  slug: 'generated-sites',
  admin: {
    useAsTitle: 'name',
    group: '신자동 런처',
    defaultColumns: ['name', 'tenant', 'type', 'status', 'deploymentUrl'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      // Users can read sites belonging to their tenants
      return {
        'tenant.user': {
          equals: user.id,
        },
      }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        'tenant.user': {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => user?.roles?.includes('admin') || false,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: '사이트명',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: '슬러그',
      admin: {
        description: 'URL에 사용될 고유 식별자',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      label: '소속 사업자',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: '사이트 유형',
      options: [
        { label: '웹사이트', value: 'website' },
        { label: '블로그', value: 'blog' },
        { label: '랜딩페이지', value: 'landing' },
        { label: '모바일 앱', value: 'app' },
        { label: '어드민 대시보드', value: 'admin' },
      ],
    },
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'business-templates',
      label: '사용 템플릿',
    },
    {
      name: 'config',
      type: 'json',
      label: '사이트 설정',
      admin: {
        description: '사이트 생성에 사용된 config.json',
      },
    },

    // === 배포 정보 ===
    {
      name: 'deployment',
      type: 'group',
      label: '배포 정보',
      fields: [
        {
          name: 'url',
          type: 'text',
          label: '배포 URL',
        },
        {
          name: 'customDomain',
          type: 'text',
          label: '커스텀 도메인',
        },
        {
          name: 'sslEnabled',
          type: 'checkbox',
          label: 'SSL 활성화',
          defaultValue: true,
        },
        {
          name: 'vercelProjectId',
          type: 'text',
          label: 'Vercel Project ID',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'lastDeployedAt',
          type: 'date',
          label: '마지막 배포일',
        },
        {
          name: 'deploymentStatus',
          type: 'select',
          label: '배포 상태',
          options: [
            { label: '대기 중', value: 'queued' },
            { label: '빌드 중', value: 'building' },
            { label: '배포됨', value: 'deployed' },
            { label: '오류', value: 'error' },
            { label: '취소됨', value: 'cancelled' },
          ],
        },
      ],
    },

    // === 블로그 설정 (블로그 타입일 경우) ===
    {
      name: 'blogSettings',
      type: 'group',
      label: '블로그 설정',
      admin: {
        condition: (data) => data?.type === 'blog',
      },
      fields: [
        {
          name: 'autoPostEnabled',
          type: 'checkbox',
          label: '자동 포스팅 활성화',
          defaultValue: false,
        },
        {
          name: 'postFrequency',
          type: 'select',
          label: '포스팅 주기',
          options: [
            { label: '매일', value: 'daily' },
            { label: '주 2회', value: 'twice_weekly' },
            { label: '주 1회', value: 'weekly' },
            { label: '월 2회', value: 'biweekly' },
            { label: '월 1회', value: 'monthly' },
          ],
        },
        {
          name: 'topics',
          type: 'array',
          label: '포스팅 주제',
          fields: [
            {
              name: 'topic',
              type: 'text',
              label: '주제',
            },
          ],
        },
        {
          name: 'writingStyle',
          type: 'select',
          label: '글 스타일',
          options: [
            { label: '친근한 이웃집', value: 'friendly' },
            { label: '전문가 톤', value: 'expert' },
            { label: '유머러스', value: 'humorous' },
            { label: '정보 전달형', value: 'informative' },
          ],
        },
      ],
    },

    // === 분석 데이터 ===
    {
      name: 'analytics',
      type: 'group',
      label: '분석 데이터',
      fields: [
        {
          name: 'totalPageViews',
          type: 'number',
          label: '총 페이지뷰',
          defaultValue: 0,
        },
        {
          name: 'totalVisitors',
          type: 'number',
          label: '총 방문자수',
          defaultValue: 0,
        },
        {
          name: 'avgSessionDuration',
          type: 'number',
          label: '평균 체류시간 (초)',
          defaultValue: 0,
        },
        {
          name: 'bounceRate',
          type: 'number',
          label: '이탈률 (%)',
          defaultValue: 0,
        },
        {
          name: 'topPages',
          type: 'json',
          label: '인기 페이지',
        },
        {
          name: 'lastUpdated',
          type: 'date',
          label: '마지막 업데이트',
        },
      ],
    },

    // === SEO 설정 ===
    {
      name: 'seo',
      type: 'group',
      label: 'SEO 설정',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: '메타 타이틀',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: '메타 설명',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'OG 이미지',
        },
        {
          name: 'keywords',
          type: 'text',
          label: '키워드',
          admin: {
            description: '쉼표로 구분',
          },
        },
        {
          name: 'googleAnalyticsId',
          type: 'text',
          label: 'Google Analytics ID',
        },
        {
          name: 'naverSiteVerification',
          type: 'text',
          label: '네이버 사이트 인증',
        },
      ],
    },

    // === 상태 ===
    {
      name: 'status',
      type: 'select',
      label: '상태',
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: '초안', value: 'draft' },
        { label: '빌드 중', value: 'building' },
        { label: '활성', value: 'active' },
        { label: '일시 중지', value: 'paused' },
        { label: '오류', value: 'error' },
        { label: '삭제됨', value: 'deleted' },
      ],
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      label: '공개 여부',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
