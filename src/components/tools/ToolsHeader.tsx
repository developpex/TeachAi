import { PLAN } from "../../utils/constants.ts";

interface ToolsHeaderProps {
  userPlan: string;
}

export function ToolsHeader({ userPlan }: ToolsHeaderProps) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-3xl font-bold text-primary-dark dark:text-dark-text">AI Teaching Tools</h1>
      <p className="mt-4 text-xl text-primary dark:text-dark-text-secondary">
        Select a tool to get started with AI-powered education
      </p>
      {userPlan === PLAN.FREE && (
        <a href="/profile/subscription" className="mt-2 text-accent underline hover:text-accent-dark">
          Upgrade to access premium tools and features
        </a>
      )}
    </div>
  );
}