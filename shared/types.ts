/**
 * Unified type exports.
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

export type EventCategory =
  | "Music"
  | "Design"
  | "Wellness"
  | "Food & drink"
  | "Community"
  | "Business";

export type RegistrationStatus = "confirmed" | "waitlist";

export type EventRecord = {
  id: string;
  title: string;
  slug: string;
  category: EventCategory;
  shortDescription: string;
  description: string;
  date: string;
  endDate?: string;
  time: string;
  venue: string;
  location: string;
  city: string;
  price: number;
  currency: string;
  capacity: number;
  registeredCount: number;
  imageTone: string;
  tags: string[];
  host: string;
  featured: boolean;
};

export type RegistrationRecord = {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  tickets: number;
  notes: string;
  status: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
};
