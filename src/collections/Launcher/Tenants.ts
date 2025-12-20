import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'businessName',
    group: '신자동 런처',
    defaultColumns: ['businessName', 'businessType', 'status', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      // Admin can read all
      if (user.roles?.includes('admin')) return true
      // Users can only read their own tenants
      return {
        user: {
          equals: user.id,
        },
      }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        user: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        user: {
          equals: user.id,
        },
      }
    },
  },
  fields: [
    // === 기본 정보 ===
    {
      name: 'businessName',
      type: 'text',
      required: true,
      label: '상호명',
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
        { label: '분식', value: 'snack' },
        { label: '베이커리', value: 'bakery' },
        { label: '프랜차이즈 본사', value: 'franchise_hq' },
        { label: '기타 요식업', value: 'other_food' },
        { label: '소매업', value: 'retail' },
        { label: '서비스업', value: 'service' },
        { label: '기타', value: 'other' },
      ],
    },
    {
      name: 'ownerName',
      type: 'text',
      label: '대표자명',
    },
    {
      name: 'phone',
      type: 'text',
      label: '연락처',
    },
    {
      name: 'email',
      type: 'email',
      label: '이메일',
    },

    // === 위치 정보 ===
    {
      name: 'location',
      type: 'group',
      label: '위치 정보',
      fields: [
        {
          name: 'address',
          type: 'text',
          label: '주소',
        },
        {
          name: 'addressDetail',
          type: 'text',
          label: '상세주소',
        },
        {
          name: 'city',
          type: 'text',
          label: '시/도',
        },
        {
          name: 'district',
          type: 'text',
          label: '시/군/구',
        },
        {
          name: 'neighborhood',
          type: 'text',
          label: '동/읍/면',
        },
        {
          name: 'postalCode',
          type: 'text',
          label: '우편번호',
        },
        {
          name: 'lat',
          type: 'number',
          label: '위도',
          admin: {
            step: 0.000001,
          },
        },
        {
          name: 'lng',
          type: 'number',
          label: '경도',
          admin: {
            step: 0.000001,
          },
        },
      ],
    },

    // === 브랜딩 ===
    {
      name: 'branding',
      type: 'group',
      label: '브랜딩',
      fields: [
        {
          name: 'primaryColor',
          type: 'text',
          label: '메인 컬러',
          admin: {
            description: 'HEX 코드 (예: #FF5733)',
          },
        },
        {
          name: 'secondaryColor',
          type: 'text',
          label: '보조 컬러',
        },
        {
          name: 'vibe',
          type: 'select',
          label: '분위기',
          options: [
            { label: '친근한/캐주얼', value: 'casual' },
            { label: '고급스러운/프리미엄', value: 'premium' },
            { label: '전통적인/정통', value: 'traditional' },
            { label: '모던/트렌디', value: 'modern' },
            { label: '아기자기한/귀여운', value: 'cute' },
            { label: '힙한/개성있는', value: 'hipster' },
          ],
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: '로고',
        },
        {
          name: 'slogan',
          type: 'text',
          label: '슬로건/캐치프레이즈',
        },
      ],
    },

    // === 타겟 & 메뉴 ===
    {
      name: 'targetCustomer',
      type: 'textarea',
      label: '타겟 고객',
      admin: {
        description: '예: 30-40대 직장인, 가족 단위 손님',
      },
    },
    {
      name: 'signatureMenu',
      type: 'array',
      label: '시그니처 메뉴',
      maxRows: 10,
      fields: [
        {
          name: 'name',
          type: 'text',
          label: '메뉴명',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          label: '가격',
        },
        {
          name: 'description',
          type: 'textarea',
          label: '설명',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '이미지',
        },
        {
          name: 'isSignature',
          type: 'checkbox',
          label: '대표 메뉴',
          defaultValue: false,
        },
      ],
    },

    // === 운영 정보 ===
    {
      name: 'operation',
      type: 'group',
      label: '운영 정보',
      fields: [
        {
          name: 'openDate',
          type: 'date',
          label: '오픈 예정일',
        },
        {
          name: 'businessHours',
          type: 'text',
          label: '영업시간',
          admin: {
            description: '예: 11:00 - 22:00',
          },
        },
        {
          name: 'closedDays',
          type: 'text',
          label: '휴무일',
        },
        {
          name: 'storeSize',
          type: 'number',
          label: '매장 평수',
        },
        {
          name: 'floors',
          type: 'number',
          label: '층수',
        },
        {
          name: 'seatingCapacity',
          type: 'number',
          label: '좌석수',
        },
      ],
    },

    // === 기능 옵션 ===
    {
      name: 'features',
      type: 'group',
      label: '기능 옵션',
      fields: [
        {
          name: 'delivery',
          type: 'checkbox',
          label: '배달 가능',
          defaultValue: false,
        },
        {
          name: 'reservation',
          type: 'checkbox',
          label: '예약 기능',
          defaultValue: false,
        },
        {
          name: 'parking',
          type: 'checkbox',
          label: '주차 가능',
          defaultValue: false,
        },
        {
          name: 'groupBooking',
          type: 'checkbox',
          label: '단체 예약',
          defaultValue: false,
        },
        {
          name: 'wifi',
          type: 'checkbox',
          label: 'WiFi',
          defaultValue: false,
        },
        {
          name: 'petFriendly',
          type: 'checkbox',
          label: '반려동물 동반',
          defaultValue: false,
        },
        {
          name: 'kidsZone',
          type: 'checkbox',
          label: '키즈존',
          defaultValue: false,
        },
      ],
    },

    // === 생성된 결과물 ===
    {
      name: 'generatedConfig',
      type: 'json',
      label: '생성된 Config',
      admin: {
        readOnly: true,
        description: '온보딩 완료 시 자동 생성됨',
      },
    },
    {
      name: 'generatedSites',
      type: 'relationship',
      relationTo: 'generated-sites',
      hasMany: true,
      label: '생성된 사이트',
    },

    // === 케어온 연동 ===
    {
      name: 'careOn',
      type: 'group',
      label: '케어온 연동',
      admin: {
        description: 'CareOn 하드웨어 연동 정보',
      },
      fields: [
        {
          name: 'subscribed',
          type: 'checkbox',
          label: '케어온 구독 여부',
          defaultValue: false,
        },
        {
          name: 'cctvCount',
          type: 'number',
          label: 'CCTV 대수',
          defaultValue: 0,
        },
        {
          name: 'posConnected',
          type: 'checkbox',
          label: 'POS 연동',
          defaultValue: false,
        },
        {
          name: 'contractDate',
          type: 'date',
          label: '계약일',
        },
        {
          name: 'contractEndDate',
          type: 'date',
          label: '계약 종료일',
        },
        {
          name: 'monthlyFee',
          type: 'number',
          label: '월 이용료',
          defaultValue: 0,
        },
      ],
    },

    // === 온보딩 진행 상태 ===
    {
      name: 'onboarding',
      type: 'group',
      label: '온보딩 상태',
      fields: [
        {
          name: 'currentStep',
          type: 'number',
          label: '현재 스텝',
          defaultValue: 1,
        },
        {
          name: 'completedSteps',
          type: 'json',
          label: '완료된 스텝',
        },
        {
          name: 'startedAt',
          type: 'date',
          label: '시작일시',
        },
        {
          name: 'completedAt',
          type: 'date',
          label: '완료일시',
        },
      ],
    },

    // === 메타 ===
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: '소유자',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: '상태',
      defaultValue: 'onboarding',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: '온보딩 중', value: 'onboarding' },
        { label: '활성', value: 'active' },
        { label: '휴면', value: 'dormant' },
        { label: '해지', value: 'cancelled' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: '메모',
      admin: {
        position: 'sidebar',
        description: '관리자용 메모',
      },
    },
  ],
  timestamps: true,
}
