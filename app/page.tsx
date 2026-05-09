import { CtaSection } from "@/components/landing/cta-section"
import { FeatureCards } from "@/components/landing/feature-cards"
import { HeroSection } from "@/components/landing/hero-section"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingNav } from "@/components/landing/landing-nav"
import { MaySection } from "@/components/landing/may-section"

export default function Page() {
  return (
    <main className="min-h-svh bg-white text-black">
      <LandingNav />
      <HeroSection />
      <MaySection />
      <FeatureCards />
      <CtaSection />
      <LandingFooter />
    </main>
  )
}
