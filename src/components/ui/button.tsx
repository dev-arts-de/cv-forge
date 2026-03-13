'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-white shadow-primary hover:shadow-primary-lg hover:scale-[1.02] active:scale-[0.98]',
        secondary:
          'border border-border bg-surface-2 text-foreground hover:bg-surface-3 hover:border-border-strong',
        outline:
          'border border-primary/30 bg-transparent text-primary hover:bg-primary-light hover:border-primary/60',
        ghost:
          'bg-transparent text-muted hover:bg-surface-2 hover:text-foreground',
        teal:
          'bg-accent-teal text-white hover:bg-accent-teal/90 shadow-[0_4px_20px_rgba(0,201,184,0.35)]',
        destructive:
          'bg-status-red-light text-status-red border border-status-red/30 hover:bg-status-red/20',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
