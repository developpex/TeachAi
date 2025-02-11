export interface ToolUsageEntry {
  toolId: string;
  toolName: string;
  timestamp: Date;
}

export interface UserToolUsage {
  userId: string;
  weekStartDate: Date;
  usages: ToolUsageEntry[];
}

export interface UsageLimit {
  weeklyLimit: number;
  currentUsage: number;
  weekStartDate: Date;
  remainingUses: number;
}