export function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="inline-flex bg-sage/5 dark:bg-dark-surface text-primary dark:text-dark-text rounded-lg px-4 py-2">
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-primary/40 dark:bg-dark-text/40 rounded-full animate-bounce" />
          <div className="w-1.5 h-1.5 bg-primary/40 dark:bg-dark-text/40 rounded-full animate-bounce delay-100" />
          <div className="w-1.5 h-1.5 bg-primary/40 dark:bg-dark-text/40 rounded-full animate-bounce delay-200" />
        </div>
      </div>
    </div>
  );
}