import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

import {
  SignedIn,
  UserButton,
  SignedOut,
  SignInButton,
  SignUpButton,
} from '@clerk/tanstack-react-start'

// components
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import Pricing from '@/components/Pricing'

function App() {
  return (
    <>
      {/* <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn> */}
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
    </>
  )
}
