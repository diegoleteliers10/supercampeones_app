import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "upcoming":
      return "badge-upcoming";
    case "live":
      return "badge-live";
    case "completed":
      return "badge-completed";
    case "blocked":
      return "badge-blocked";
    default:
      return "badge-upcoming";
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "upcoming":
      return "Próximo";
    case "live":
      return "En Vivo";
    case "completed":
      return "Finalizado";
    case "blocked":
      return "Bloqueado";
    default:
      return status;
  }
}
