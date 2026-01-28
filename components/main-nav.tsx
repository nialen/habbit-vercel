import { cn } from "@/lib/utils"

interface MainNavProps extends React.HTMLAttributes<HTMLElement> { }

export function MainNav({ className, ...props }: MainNavProps) {
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            {/* Placeholder content or mobile nav trigger could go here */}
        </nav>
    )
}
