"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { OnboardingModal } from "./onboarding-modal";

export function OnboardingWrapper() {
  const { data: session, status } = useSession();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkOnboarding() {
      if (status !== "authenticated" || !session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/user/preferences");
        if (res.ok) {
          const preferences = await res.json();
          if (!preferences.onboardingCompleted) {
            setShowOnboarding(true);
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkOnboarding();
  }, [session, status]);

  const handleComplete = async (preferences: {
    primaryUseCase: string;
    usedAdvancedTools: boolean;
  }) => {
    try {
      await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...preferences,
          onboardingCompleted: true,
        }),
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
    setShowOnboarding(false);
  };

  const handleSkip = async () => {
    try {
      await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          onboardingCompleted: true,
        }),
      });
    } catch (error) {
      console.error("Error skipping onboarding:", error);
    }
    setShowOnboarding(false);
  };

  if (isLoading || !showOnboarding) {
    return null;
  }

  return <OnboardingModal onComplete={handleComplete} onSkip={handleSkip} />;
}
