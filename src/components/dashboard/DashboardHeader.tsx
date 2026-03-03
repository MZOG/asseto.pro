import { NotificationCenter } from './DashboardNotifications'

export default function DashboardHeader() {
  return (
    <header className="bg-white w-full z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-4">
        <div></div>
        <NotificationCenter />
      </div>
    </header>
  )
}
