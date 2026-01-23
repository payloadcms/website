export const MOCK_ACTIVE_USERS = {
    totalActiveUsers: 847,
    locations: [
        { country: 'United States', activeUsers: 423 },
        { country: 'United Kingdom', activeUsers: 189 },
        { country: 'Germany', activeUsers: 235 },
    ],
    timestamp: new Date().toISOString(),
};
export const MOCK_ANALYTICS_METRICS = {
    activeUsers: 12547,
    totalUsers: 45823,
    totalPageViews: 189432,
    eventCount: 523891,
    keyEvents: 8934,
    period: 'Last 7 days',
    chartData: [
        { date: '20260116', users: 11234 },
        { date: '20260117', users: 12456 },
        { date: '20260118', users: 10987 },
        { date: '20260119', users: 13234 },
        { date: '20260120', users: 14567 },
        { date: '20260121', users: 12987 },
        { date: '20260122', users: 13456 },
        { date: '20260123', users: 12547 },
    ],
    topPages: [
        { page: '/', views: 45678 },
        { page: '/blog/web-development-trends-2026', views: 34567 },
        { page: '/products/featured-item', views: 28934 },
        { page: '/blog/performance-optimization-guide', views: 23456 },
        { page: '/services', views: 19876 },
        { page: '/blog/mobile-first-design', views: 17654 },
        { page: '/products/category/electronics', views: 15432 },
        { page: '/resources/tutorials', views: 13298 },
        { page: '/about', views: 11987 },
        { page: '/contact', views: 9876 },
    ],
};
export const MOCK_CHANNEL_GROUPS = {
    totalSessions: 67845,
    period: 'Last 7 days',
    timestamp: new Date().toISOString(),
    channels: [
        { channel: 'Organic Search', sessions: 34567 },
        { channel: 'Direct', sessions: 18934 },
        { channel: 'Referral', sessions: 8234 },
        { channel: 'Organic Social', sessions: 3456 },
        { channel: 'Paid Search', sessions: 1789 },
        { channel: 'Organic Video', sessions: 654 },
        { channel: 'Unassigned', sessions: 211 },
    ],
};
//# sourceMappingURL=mockData.js.map