"use client"

import React, { use, useEffect, useState } from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/shared/libs/utils"
import { Moon, Sun } from "lucide-react"
import "../../shared/styles/utils.css"
import { useTheme } from "next-themes"

// radix와 shadcn/ui 디자인을 기반으로하여 만든 테마 변경 컴포넌트(클라 컴포)
const ThemeSwitcher = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {

  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false); // fallback theme is light

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme])

  
  return(
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className
      )}
      {...props}
      ref={ref}
      checked={isDark}
      onCheckedChange={isLight => setTheme(isLight ? "dark" : "light")}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      >
      <div className="dead-center">
        {isDark && <Moon size={15}/> || <Sun size={15} />}
      </div>


      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
    )}
  )
ThemeSwitcher.displayName = SwitchPrimitives.Root.displayName

export { ThemeSwitcher }
