export function DeleteAccount() {
  return (
    <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8">
      <h3 className="text-xl font-semibold text-primary-dark dark:text-dark-text mb-4">Delete Account</h3>
      <p className="text-primary dark:text-dark-text-secondary mb-4">
        Once you delete your account, there is no going back. Please be certain.
      </p>
      <button className="px-4 py-2 text-sm font-medium text-accent dark:text-accent border-2 border-accent dark:border-accent rounded-lg hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-white transition-all duration-300">
        Delete Account
      </button>
    </div>
  );
}