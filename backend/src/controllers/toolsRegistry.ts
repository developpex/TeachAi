import { processLessonPlan } from './handlers/lessonPlanHandler';
import {
    processLessonPlanEnterprise
} from './handlers/enterprise/lessonPlanEnterpriseHandler';
import {processNewsletter} from "./handlers/newsletterHandler";

export type ToolHandler = (
    data: any,
    sendChunk: (chunk: string) => void
) => Promise<void>;

export const toolHandlers: Record<string, ToolHandler> = {
    'ai-lesson-planner': processLessonPlan,
    'ai-newsletter-generator': processNewsletter,

    'enterprise-test': processLessonPlanEnterprise,

};
