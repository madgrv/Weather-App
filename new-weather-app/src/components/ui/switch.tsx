import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(event.target.checked);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLLabelElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (onCheckedChange) {
          onCheckedChange(!checked);
        }
      }
    };

    return (
      <label
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 border",
          checked ? "bg-primary border-primary" : "bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600",
          className
        )}
        tabIndex={0}
        role="switch"
        aria-checked={checked}
        onKeyDown={handleKeyDown}
      >
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform border border-slate-200 dark:border-slate-700",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </label>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
