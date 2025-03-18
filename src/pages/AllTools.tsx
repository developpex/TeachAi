import { ToolGrid } from '../components/tools/ToolGrid';
import { ToolsHeader } from '../components/tools/ToolsHeader';
import { ToolsSearch } from '../components/tools/ToolsSearch';
import { ToolsFilters } from '../components/tools/ToolsFilters';
import { UsageLimitBanner } from '../components/tools/UsageLimitBanner';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { useToolsPage } from '../hooks/useToolsPage';
import { useToolUsage } from '../hooks/useToolUsage';
import { PLAN } from "../utils/constants.ts";

export function AllTools() {
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
      <div className="min-h-screen bg-background dark:bg-dark-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background py-8">
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
          <ToolGrid tools={categorizedTools.enterprise} title="Enterprise Tools" />
        </div>
      </div>
    </div>
  );
}