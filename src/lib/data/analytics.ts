import { getDashboardMetrics as dbGetDashboardMetrics, getRecentActivity as dbGetRecentActivity, DbCase } from '../db/database';
import { MockCase } from './mockCases';

export interface DashboardMetrics {
  totalMissing: number;
  totalFound: number;
  pendingModeration: number;
  totalTips?: number;
  totalMatches: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return await dbGetDashboardMetrics();
}

export async function getRecentActivity(limit = 10): Promise<MockCase[]> {
  return (await dbGetRecentActivity(limit)) as any;
}
