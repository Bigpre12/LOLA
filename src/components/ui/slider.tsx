"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  showValue?: boolean;
  onChange?: (value: number) => void;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, showValue = true, value, onChange, id, min = 0, max = 100, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <div className="flex justify-between items-center mb-2">
            <label htmlFor={id} className="block text-sm font-medium text-slate-300">
              {label}
            </label>
            {showValue && (
              <span className="text-sm font-medium text-violet-400">{value}</span>
            )}
          </div>
        )}
        <input
          ref={ref}
          type="range"
          id={id}
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className={cn(
            "w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer",
            "accent-violet-500",
            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4",
            "[&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
