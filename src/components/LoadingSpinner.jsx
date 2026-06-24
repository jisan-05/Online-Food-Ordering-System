function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div className="flex min-h-48 items-center justify-center">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <span className="size-5 animate-spin rounded-full border-2 border-slate-200 border-t-orange-500" />
        <span className="text-sm font-bold text-slate-600">{label}</span>
      </div>
    </div>
  )
}

export default LoadingSpinner
