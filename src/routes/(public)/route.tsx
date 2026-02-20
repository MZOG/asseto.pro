import { createFileRoute, Outlet } from '@tanstack/react-router'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const Route = createFileRoute('/(public)')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <>
      <Header />
      <div className="mt-28">
        <Outlet />
      </div>
      <Footer />
    </>
  )
}
