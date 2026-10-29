import type { EventRecord } from "@shared/types";

export function formatEventDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function formatEventDay(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
  }).format(new Date(`${date}T12:00:00`));
}

export function formatEventMonth(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
  }).format(new Date(`${date}T12:00:00`)).toUpperCase();
}

export function getRemainingSpots(event: EventRecord) {
  return Math.max(event.capacity - event.registeredCount, 0);
}

export function formatPrice(event: EventRecord) {
  if (event.price === 0) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: event.currency,
    maximumFractionDigits: 0,
  }).format(event.price);
}
