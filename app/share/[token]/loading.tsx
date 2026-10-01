export default function Loading() {
  return (
    <div
      className="flex min-h-screen flex-col bg-background"
      role="status"
      aria-busy="true"
    >
      <div className="h-14 border-b border-border" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex items-start gap-3.5">
          <span className="fx-skeleton size-9 rounded-lg" />
          <div className="space-y-2">
            <span className="fx-skeleton block h-5 w-64" />
            <span className="fx-skeleton block h-3.5 w-80 max-w-full" />
          </div>
        </div>
        <span className="fx-skeleton block min-h-[60vh] rounded-xl" />
        <span className="sr-only">Loading shared file…</span>
      </div>
    </div>
  );
}
