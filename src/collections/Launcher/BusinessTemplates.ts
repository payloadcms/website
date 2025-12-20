import type { CollectionConfig } from 'payload'

export const BusinessTemplates: CollectionConfig = {
  slug: 'business-templates',
  admin: {
    useAsTitle: 'name',
    group: '신자동 런처',
    defaultColumns: ['name', 'businessType', 'order', 'isActive'],
  },
  access: {
    read: () => true, // 템플릿은 모두 읽기 가능
    create: ({ req: { user } }) => user?.roles?.includes('admin') || false,
    update: ({ req: { user } }) => user?.roles?.includes('admin') || false,
    delete: ({ req: { user } }) => user?.roles?.includes('admin') || false,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: '템플릿명',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: '슬러그',
    },
    {
      name: 'businessType',
      type: 'select',
      required: true,
      label: '업종',
      options: [
        { label: '고기집/정육점', value: 'meat' },
        { label: '카페/디저트', value: 'cafe' },
        { label: '한식', value: 'korean' },
        { label: '일식', value: 'japanese' },
        { label: '중식', value: 'chinese' },
        { label: '양식', value: 'western' },
        { label: '치킨/피자', value: 'chicken_pizza' },
        { label: '베이커리', value: 'bakery' },
        { label: '프랜차이즈 본사', value: 'franchise_hq' },
        { label: '범용', value: 'general' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: '설명',
    },
    {
      name: 'shortDescription',
      type: 'text',
      label: '짧은 설명',
      admin: {
        description: '카드에 표시될 한 줄 설명',
      },
    },
    {
      name: 'previewImage',
      type: 'upload',
      relationTo: 'media',
      label: '미리보기 이미지',
    },
    {
      name: 'previewImages',
      type: 'array',
      label: '미리보기 이미지 갤러리',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '이미지',
        },
        {
          name: 'caption',
          type: 'text',
          label: '캡션',
        },
      ],
    },
    {
      name: 'demoUrl',
      type: 'text',
      label: '데모 URL',
    },

    // === 템플릿 구성 ===
    {
      name: 'baseConfig',
      type: 'json',
      label: '기본 설정 (JSON)',
      admin: {
        description: '템플릿의 기본 config.json 구조',
      },
    },
    {
      name: 'components',
      type: 'array',
      label: '포함 컴포넌트',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: '컴포넌트명',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          label: '유형',
          required: true,
          options: [
            { label: 'Hero 섹션', value: 'hero' },
            { label: '소개 섹션', value: 'about' },
            { label: '메뉴 목록', value: 'menu' },
            { label: '갤러리', value: 'gallery' },
            { label: '위치/지도', value: 'location' },
            { label: '리뷰/후기', value: 'reviews' },
            { label: '연락처', value: 'contact' },
            { label: '예약 폼', value: 'reservation' },
            { label: '푸터', value: 'footer' },
            { label: '블로그', value: 'blog' },
            { label: 'FAQ', value: 'faq' },
            { label: '팀 소개', value: 'team' },
            { label: '서비스', value: 'services' },
            { label: '가격표', value: 'pricing' },
            { label: 'CTA 배너', value: 'cta' },
          ],
        },
        {
          name: 'isRequired',
          type: 'checkbox',
          label: '필수 여부',
          defaultValue: false,
        },
        {
          name: 'order',
          type: 'number',
          label: '순서',
        },
        {
          name: 'defaultConfig',
          type: 'json',
          label: '기본 설정',
        },
      ],
    },

    // === 색상 팔레트 ===
    {
      name: 'colorPalettes',
      type: 'array',
      label: '추천 색상 팔레트',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: '팔레트명',
        },
        {
          name: 'primary',
          type: 'text',
          label: '메인 컬러',
        },
        {
          name: 'secondary',
          type: 'text',
          label: '보조 컬러',
        },
        {
          name: 'accent',
          type: 'text',
          label: '강조 컬러',
        },
        {
          name: 'background',
          type: 'text',
          label: '배경 컬러',
        },
      ],
    },

    // === 폰트 설정 ===
    {
      name: 'fonts',
      type: 'group',
      label: '폰트 설정',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: '제목 폰트',
          admin: {
            description: 'Google Fonts 이름',
          },
        },
        {
          name: 'body',
          type: 'text',
          label: '본문 폰트',
        },
      ],
    },

    // === Git 정보 ===
    {
      name: 'gitRepo',
      type: 'text',
      label: 'Git Repository URL',
    },
    {
      name: 'gitBranch',
      type: 'text',
      label: 'Git Branch',
      defaultValue: 'main',
    },

    // === 태그 및 분류 ===
    {
      name: 'tags',
      type: 'array',
      label: '태그',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: '특징',
      fields: [
        {
          name: 'feature',
          type: 'text',
          label: '특징',
        },
        {
          name: 'icon',
          type: 'text',
          label: '아이콘',
        },
      ],
    },

    // === 가격 ===
    {
      name: 'pricing',
      type: 'group',
      label: '가격 정보',
      fields: [
        {
          name: 'isFree',
          type: 'checkbox',
          label: '무료 여부',
          defaultValue: true,
        },
        {
          name: 'price',
          type: 'number',
          label: '가격 (원)',
          admin: {
            condition: (data, siblingData) => !siblingData?.isFree,
          },
        },
        {
          name: 'freeWithCareOn',
          type: 'checkbox',
          label: '케어온 연동 시 무료',
          defaultValue: true,
        },
      ],
    },

    // === 메타 ===
    {
      name: 'order',
      type: 'number',
      label: '정렬 순서',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: '활성화',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: '추천 템플릿',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'usageCount',
      type: 'number',
      label: '사용 횟수',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
