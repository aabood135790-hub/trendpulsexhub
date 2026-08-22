// Analytics Client Utility for Pageviews, Visitors & Interaction Metrics

const VISITOR_STORAGE_KEY = 'trendpulse_visitor_id';

export function getOrCreateVisitorId(): string {
  try {
    let vid = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem(VISITOR_STORAGE_KEY, vid);
    }
    return vid;
  } catch {
    return 'v_temp_' + Date.now();
  }
}

export async function trackPageView(path?: string, title?: string): Promise<void> {
  try {
    const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/');
    const currentTitle = title || (typeof document !== 'undefined' ? document.title : '');
    const visitorId = getOrCreateVisitorId();

    await fetch('/api/analytics/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: currentPath,
        title: currentTitle,
        visitorId,
        eventType: 'pageview',
      }),
    });
  } catch (err) {
    // Non-blocking analytics error
  }
}

export async function trackUserInteraction(eventType: 'code_copy' | 'signup' | 'newsletter_sub', detail: string): Promise<void> {
  try {
    const visitorId = getOrCreateVisitorId();
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

    await fetch('/api/analytics/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: currentPath,
        visitorId,
        eventType,
        detail,
      }),
    });
  } catch (err) {
    // Non-blocking analytics error
  }
}

export interface AnalyticsSummary {
  metrics: {
    totalPageViews: number;
    todayViews: number;
    uniqueVisitors: number;
    registeredUsersCount: number;
    newsletterSubscribersCount: number;
    activeSessionsEstimate: number;
    totalGamesMonitored: number;
    lastUpdated: string;
  };
  topPages: Array<{ path: string; views: number }>;
  dailyViews: Record<string, number>;
  recentEvents: Array<{
    id: string;
    type: 'pageview' | 'signup' | 'code_copy' | 'newsletter_sub';
    path?: string;
    detail?: string;
    timestamp: string;
    userAgent?: string;
  }>;
  recentUsers: Array<{
    id: string;
    username: string;
    display_name: string;
    role: string;
    credits: number;
    created_at: string;
    avatar_url?: string;
  }>;
}

export async function fetchAnalyticsStats(): Promise<AnalyticsSummary | null> {
  try {
    const res = await fetch('/api/analytics/stats');
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Failed to fetch analytics stats:', err);
  }
  return null;
}
