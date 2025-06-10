"use client"

import { useFirstLogin } from "@/hooks/use-first-login"
import { ProfileSetupModal } from "@/components/profile-setup-modal"

export function FirstLoginHandler() {
  const { shouldShowSetup, markSetupComplete } = useFirstLogin()

  return (
    <ProfileSetupModal 
      open={shouldShowSetup}
      onOpenChange={(open) => {
        if (!open) {
          markSetupComplete()
        }
      }}
    />
  )
} 