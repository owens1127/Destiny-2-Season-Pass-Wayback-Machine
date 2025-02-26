"use client";

import { Cog, Moon, Sun } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";

import dynamic from "next/dynamic";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ThemeButtonComponent = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="secondary"
        onClick={() =>
          setTheme((theme) => (theme === "system" ? "dark" : "system"))
        }
      >
        {theme === "system" ? "Set Theme" : "Use System"}
      </Button>
      {theme === "system" ? (
        <div className="flex items-center space-x-2">
          <Cog className="h-4 w-4" />
          <span className="text-sm font-medium">System Mode</span>
        </div>
      ) : (
        <>
          <Sun className="h-4 w-4" />
          <Switch
            id="theme-switch"
            checked={theme === "dark"}
            onCheckedChange={() =>
              setTheme((theme) => (theme === "dark" ? "light" : "dark"))
            }
          />
          <Moon className="h-4 w-4" />
          <Label htmlFor="theme-switch" className="sr-only">
            Toggle theme
          </Label>
        </>
      )}
    </div>
  );
};

const ThemeButtonWrapper = () => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <ThemeButtonComponent />
  </ThemeProvider>
);

export const ThemeButton = dynamic(() => Promise.resolve(ThemeButtonWrapper), {
  ssr: false,
});
