import { getDashboardMetrics as dbGetDashboardMetrics, getRecentActivity as dbGetRecentActivity, DbCase } from '../db/database';
import { MockCase } from './mockCases';

export interface DashboardMetrics {
  totalMissing: number;
  totalFound: number;
  pendingModeration: number;
  totalTips?: number;
  totalMatches: number;
}

export function getDashboardMetrics(): DashboardMetrics {
  return dbGetDashboardMetrics();
}

export function getRecentActivity(limit = 10): MockCase[] {
  return dbGetRecentActivity(limit) as any;
}
