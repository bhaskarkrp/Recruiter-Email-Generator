"use client";

import React from "react";
import * as SelectPrimitive from "@radix-ui/react-radio-group";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.RadioGroup>
>(({ children, className, ...props }, ref) => (
  <SelectPrimitive.Root
    ref={ref}
    className={cn("flex flex-col mt-2", className)}
    defaultValue="option1"
    aria-label="Select an option"
    {...props}
  >
    {children}
  </SelectPrimitive.Root>
));

const RadioItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.RadioGroupItem>
>(({ children, className, ...props }, ref) => (
  <div className="flex items-center justify-start">
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relaive w-5 h-5 rounded-full border-2 border-gray-400 data-[state=checked]:border-black",
        className
      )}
      {...props}
    >
      <SelectPrimitive.Indicator className="flex items-center justify-center w-full h-full">
        <CheckIcon className="w-3 h-3 text-black" />
      </SelectPrimitive.Indicator>
    </SelectPrimitive.Item>
    <span className="ml-3">{children}</span>
  </div>
));

export { RadioGroup, RadioItem };
