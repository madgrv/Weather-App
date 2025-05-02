import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { cn } from '../../lib/utils';

const Combobox = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className
    )}
    {...props}
  />
));
Combobox.displayName = 'Combobox';

const ComboboxInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Input
    ref={ref}
    className={cn(
      'h-[3em] w-full px-4 border-2 rounded-sm',
      'border-primary focus:outline-none focus:ring-2 focus:ring-primary/50',
      className
    )}
    {...props}
  />
));
ComboboxInput.displayName = 'ComboboxInput';

const ComboboxList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      'absolute z-50 mt-1 max-h-96 w-full overflow-auto rounded-md',
      'border bg-popover p-1 shadow-md',
      'animate-in fade-in-0 zoom-in-95',
      className
    )}
    {...props}
  />
));
ComboboxList.displayName = 'ComboboxList';

const ComboboxItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  />
));
ComboboxItem.displayName = 'ComboboxItem';

export { Combobox, ComboboxInput, ComboboxList, ComboboxItem };
