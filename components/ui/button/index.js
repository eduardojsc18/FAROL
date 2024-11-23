import { cva } from 'class-variance-authority';

export { default as Button } from './Button.vue';

export const buttonVariants = cva(
  'shadcn-inline-flex shadcn-items-center shadcn-justify-center shadcn-gap-2 shadcn-whitespace-nowrap shadcn-rounded-md shadcn-text-sm shadcn-font-medium shadcn-ring-offset-background shadcn-transition-colors focus-visible:shadcn-outline-none focus-visible:shadcn-ring-2 focus-visible:shadcn-ring-ring focus-visible:shadcn-ring-offset-2 disabled:shadcn-pointer-events-none disabled:shadcn-opacity-50 [&_svg]:shadcn-pointer-events-none [&_svg]:shadcn-size-4 [&_svg]:shadcn-shrink-0',
  {
    variants: {
      variant: {
        default:
          'shadcn-bg-primary shadcn-text-primary-foreground shadcn-shadow hover:shadcn-bg-primary/90',
        destructive:
          'shadcn-bg-destructive shadcn-text-destructive-foreground shadcn-shadow-sm hover:shadcn-bg-destructive/90',
        outline:
          'shadcn-border shadcn-border-input shadcn-bg-background shadcn-shadow-sm hover:shadcn-bg-accent hover:shadcn-text-accent-foreground',
        secondary:
          'shadcn-bg-secondary shadcn-text-secondary-foreground shadcn-shadow-sm hover:shadcn-bg-secondary/80',
        ghost: 'hover:shadcn-bg-accent hover:shadcn-text-accent-foreground',
        link: 'shadcn-text-primary shadcn-underline-offset-4 hover:shadcn-underline',
      },
      size: {
        default: 'shadcn-h-9 shadcn-px-4 shadcn-py-2',
        sm: 'shadcn-h-8 shadcn-rounded-md shadcn-px-3 shadcn-text-xs',
        lg: 'shadcn-h-10 shadcn-rounded-md shadcn-px-8',
        icon: 'shadcn-h-9 shadcn-w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
