// app/routes/dashboard.issues.tsx
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/issues/')({
  component: () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Aktywne Awarie</h1>
        {/* <Link
          to="/dashboard/issues/archive"
          className="text-sm text-gray-500 hover:underline"
        >
          Zobacz archiwum
        </Link> */}
      </div>
      {/* Lista awarii z bazy Convex */}
      <Link
        to="/dashboard/issues/1"
        className="block p-4 bg-gray-50 rounded mb-2 hover:bg-gray-100"
      >
        <h2>Awaria #1: Drukarka nie działa</h2>
        <p className="text-sm text-gray-600">Zgłoszona 2 godziny temu</p>
      </Link>
    </div>
  ),
})
