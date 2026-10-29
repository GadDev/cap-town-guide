import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
export const cn=(...inputs:ClassValue[])=>twMerge(clsx(inputs));
const variants=cva('ui-button',{variants:{variant:{default:'ui-default',outline:'ui-outline',ghost:'ui-ghost'},size:{default:'ui-size-default',sm:'ui-size-sm'}},defaultVariants:{variant:'default',size:'default'}});
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,VariantProps<typeof variants>{asChild?:boolean}
export const Button=React.forwardRef<HTMLButtonElement,ButtonProps>(({variant,size,asChild=false,className,...props},ref)=>{const Comp=asChild?Slot:'button';return <Comp ref={ref} className={cn(variants({variant,size}),className)} {...props}/>});
Button.displayName='Button';
