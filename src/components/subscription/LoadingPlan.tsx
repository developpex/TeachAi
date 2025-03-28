export function LoadingPlan() {
  return (
    <div className="bg-white rounded-lg shadow-soft p-6 border border-sage/10">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-sage/20 h-12 w-12"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-sage/20 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-sage/20 rounded"></div>
            <div className="h-4 bg-sage/20 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}