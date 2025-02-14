import { ToolGrid } from '../components/tools/ToolGrid';
import { ToolsHeader } from '../components/tools/ToolsHeader';
import { ToolsSearch } from '../components/tools/ToolsSearch';
import { ToolsFilters } from '../components/tools/ToolsFilters';
import { UsageLimitBanner } from '../components/tools/UsageLimitBanner';
import { useToolsPage } from '../hooks/useToolsPage';
import { useToolUsage } from '../hooks/useToolUsage';
import {PLAN} from "../utils/constants.ts";

export function Tools() {
  const {
    loading,
    categorizedTools,
    availableCategories,
    selectedCategory,
    setSelectedCategory,
    selectedToolCategory,
    setSelectedToolCategory,
    searchQuery,
    setSearchQuery,
    userPlan,
    isDropdownOpen,
    setIsDropdownOpen,
    getToolCategoryLabel
  } = useToolsPage();

  const { usageLimit, loading: loadingUsage } = useToolUsage();

  if (loading || loadingUsage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ToolsHeader userPlan={userPlan} />

        {/* Show usage limit banner for free plan users */}
        {userPlan === PLAN.FREE && usageLimit && (
          <UsageLimitBanner usageLimit={usageLimit} />
        )}

        {/* Filters */}
        <div className="mb-8 space-y-6">
          <ToolsSearch 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <ToolsFilters
            availableCategories={availableCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedToolCategory={selectedToolCategory}
            setSelectedToolCategory={setSelectedToolCategory}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            getToolCategoryLabel={getToolCategoryLabel}
          />
        </div>

        {/* Tools Sections */}
        <div className="space-y-12">
          <ToolGrid tools={categorizedTools.free} title="Free Tools" />
          <ToolGrid tools={categorizedTools.plus} title="Plus Tools" />
        </div>
      </div>
    </div>
  );
}