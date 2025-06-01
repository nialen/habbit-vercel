import { cn } from "@/lib/utils"

interface NavIconProps {
  name: "rocket" | "badge-bunny" | "ai-orb" | "panda-run" | "chart-koala" | "gift-astrocat" | "bell-star" | "salon-group" | "community-chat"
  className?: string
}

export function NavIcon({ name, className }: NavIconProps) {
  return (
    <div 
      className={cn("inline-flex items-center justify-center", className)}
      style={{
        WebkitMask: `url(/sprites/${name}.svg) no-repeat center / contain`,
        mask: `url(/sprites/${name}.svg) no-repeat center / contain`,
        backgroundColor: "currentColor"
      }}
    />
  )
}

// Alternative implementation using img tag for better SVG support
export function NavIconImg({ name, className }: NavIconProps) {
  return (
    <img 
      src={`/sprites/${name}.svg`} 
      alt={`${name} icon`}
      className={cn("inline-block", className)}
    />
  )
}
