import { processLessonPlan } from './handlers/lessonPlanHandler';
import {
    processLessonPlanEnterprise
} from './handlers/enterprise/lessonPlanEnterpriseHandler';

export type ToolHandler = (
    data: any,
    sendChunk: (chunk: string) => void
) => Promise<void>;

export const toolHandlers: Record<string, ToolHandler> = {
    'ai-lesson-planner': processLessonPlan,
    'enterprise-test': processLessonPlanEnterprise,
};
