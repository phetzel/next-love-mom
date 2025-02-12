import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/landing-page/feature-card";
import { WavyBackground } from "@/components/landing-page/wavy-background";
import { features } from "@/lib/features";
import { Logo } from "@/components/logo";
export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <WavyBackground>
        <div className="min-h-screen flex flex-col items-center justify-center px-8 pb-20">
          <div className="flex items-center mb-4">
            <Logo />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            I Love You Forever
          </h1>

          <p className="max-w-2xl text-xl md:text-2xl text-primary text-center mb-8 drop-shadow-lg">
            Create a treasure trove of loving memories for someone special
          </p>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/sign-in">Sign In</Link>
            </Button>

            {/* <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/sign-up">Register</Link>
            </Button> */}
          </div>
        </div>
      </WavyBackground>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-black mb-12 drop-shadow-lg">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={<feature.icon className="w-12 h-12 text-primary" />}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
