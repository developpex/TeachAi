import { Request, Response } from 'express';
import { processLessonPlan } from './tools/lessonPlanHandler';

// Tool handlers map
export const toolHandlers: Record<string, (data: any) => Promise<any>> = {
  'ai-lesson-planner': processLessonPlan,
};

export { processLessonPlan };