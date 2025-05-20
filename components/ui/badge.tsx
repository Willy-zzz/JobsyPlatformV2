import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Categorías de cursos
        frontend: "bg-blue-100 hover:bg-blue-200 text-blue-800",
        backend: "bg-green-100 hover:bg-green-200 text-green-800",
        fullstack: "bg-purple-100 hover:bg-purple-200 text-purple-800",
        mobile: "bg-orange-100 hover:bg-orange-200 text-orange-800",
        devops: "bg-red-100 hover:bg-red-200 text-red-800",
        database: "bg-cyan-100 hover:bg-cyan-200 text-cyan-800",
        security: "bg-slate-100 hover:bg-slate-200 text-slate-800",
        cloud: "bg-blue-100 hover:bg-blue-200 text-blue-800",
        ia: "bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-800",
        design: "bg-emerald-100 hover:bg-emerald-200 text-emerald-800",
        algorithms: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800",
        // Niveles de dificultad
        principiante: "bg-green-100 hover:bg-green-200 text-green-800",
        intermedio: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800",
        avanzado: "bg-red-100 hover:bg-red-200 text-red-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
