import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/')({ component: App })

// components
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import Pricing from '@/components/Pricing'

function App() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
    </>
  )
}
