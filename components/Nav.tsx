"use client";

import { useLayoutEffect, useState } from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Nav = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const el = document.documentElement;

    if (el.classList.contains("dark")) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  const toggleDark = () => {
    const el = document.documentElement;
    el.classList.toggle("dark");
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="px-4 py-2 flex items-center h-14 z-50 bg-card border-b border-border">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-xl">
          VoiceVitals+
        </Link>
        <nav className="hidden md:flex gap-4">
          <Link href="/checkin">
            <Button
              variant={pathname === "/checkin" ? "default" : "ghost"}
              size="sm"
            >
              New Check-In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant={pathname === "/dashboard" ? "default" : "ghost"}
              size="sm"
            >
              History
            </Button>
          </Link>
        </nav>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Button
          onClick={toggleDark}
          variant="ghost"
          className="ml-auto flex items-center gap-1.5"
        >
          <span>
            {isDarkMode ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </span>
          <span>{isDarkMode ? "Light" : "Dark"} Mode</span>
        </Button>
      </div>
    </div>
  );
};
