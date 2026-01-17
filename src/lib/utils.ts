import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1; // 1-12
  
  if (month >= 6 && month <= 9) return "Kharif"; // Monsoon season
  if (month >= 10 || month <= 3) return "Rabi"; // Winter season
  return "Zaid"; // Summer season (April-May)
}

export function getSeasonalGreeting(): string {
  const hour = new Date().getHours();
  const season = getCurrentSeason();
  
  if (hour < 12) return `Good morning! It's ${season} season.`;
  if (hour < 17) return `Good afternoon! It's ${season} season.`;
  return `Good evening! It's ${season} season.`;
}
