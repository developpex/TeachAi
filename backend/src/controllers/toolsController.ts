import { processLessonPlan } from './tools/lessonPlanHandler';

// Tool handlers map
export const toolHandlers: Record<
    string,
    (params: { data: any; sendChunk: (chunk: string) => void }) => Promise<any>
> = {
  'ai-lesson-planner': ({ data, sendChunk }) => processLessonPlan(data, sendChunk),
};

export { processLessonPlan };