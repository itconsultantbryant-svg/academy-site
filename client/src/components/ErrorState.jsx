import { Link } from 'react-router-dom'

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this content right now.',
  retryLabel = 'Try again',
  onRetry,
}) {
  return (
    <section
      className="glass-card space-y-3 border-rose-300/40 p-6 md:p-8"
      role="alert"
      aria-live="assertive"
    >
      <h2 className="text-2xl font-semibold text-rose-100">{title}</h2>
      <p className="text-rose-200">{message}</p>
      <div className="flex flex-wrap items-center gap-3">
        {onRetry ? (
          <button type="button" onClick={onRetry}>
            {retryLabel}
          </button>
        ) : null}
        <Link
          to="/"
          className="rounded-md border border-white/20 px-3 py-2 text-sm text-slate-100 transition hover:bg-white/10"
        >
          Go to homepage
        </Link>
      </div>
    </section>
  )
}
