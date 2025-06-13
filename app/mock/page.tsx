import { MockAuthProvider } from '@/components/auth/mock-auth-provider'
import { MockApp } from '@/components/mock-app'

export default function MockPage() {
  return (
    <MockAuthProvider>
      <MockApp />
    </MockAuthProvider>
  )
} 